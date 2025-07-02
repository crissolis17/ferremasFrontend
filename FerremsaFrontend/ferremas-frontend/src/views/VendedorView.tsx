import React, { useState, useEffect } from 'react';
import GestionClientes from '../components/vendedor/GestionClientes';
import ClienteRegistro from '../components/vendedor/ClienteRegistro';
import Carrito from '../components/sales/Carrito';
import Checkout from '../components/sales/Checkout';
import ConfirmacionPedido from '../components/sales/ConfirmacionPedido';
import OpenCarritoButton from '../components/ui/OpenCarritoButton';
import type { CheckoutResponseDTO, ClienteResponseDTO, PedidoResponseDTO, ProductoResponseDTO } from '../types/api';
import { apiClient } from '../services/api';

const VendedorView: React.FC = () => {
  const [carritoOpen, setCarritoOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [clienteRegistroOpen, setClienteRegistroOpen] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<CheckoutResponseDTO | null>(null);
  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([]);
  const [pedidos, setPedidos] = useState<PedidoResponseDTO[]>([]);
  const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalClientes: 0,
    pedidosPendientes: 0,
    ventasHoy: 0
  });

  const handleCheckoutSuccess = (pedido: CheckoutResponseDTO) => {
    setPedidoConfirmado(pedido);
    setConfirmacionOpen(true);
    setCarritoOpen(false);
    setCheckoutOpen(false);
  };

  const handleCloseConfirmacion = () => {
    setConfirmacionOpen(false);
    setPedidoConfirmado(null);
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar cargar datos de la API
      const [clientesResponse, pedidosResponse, productosResponse] = await Promise.all([
        apiClient.get<any>('/api/Clientes'),
        apiClient.get<any>('/api/Pedidos'),
        apiClient.get<any>('/api/Productos')
      ]);

      // Extraer datos de manera flexible
      const clientesData = clientesResponse.data?.datos || clientesResponse.data || [];
      const pedidosData = pedidosResponse.data?.datos || pedidosResponse.data || [];
      const productosData = productosResponse.data?.datos || productosResponse.data || [];

      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);

      // Calcular estadísticas
      const pedidosPendientes = pedidosData.filter((p: any) => 
        p.estado === 'PENDIENTE' || p.estado === 'EN_PROCESO'
      ).length;

      const hoy = new Date().toISOString().split('T')[0];
      const ventasHoy = pedidosData.filter((p: any) => 
        p.fechaCreacion?.includes(hoy) && p.estado === 'COMPLETADO'
      ).reduce((sum: number, p: any) => sum + (p.total || 0), 0);

      setStats({
        totalClientes: clientesData.length || 0,
        pedidosPendientes,
        ventasHoy
      });

      console.log('✅ Datos cargados exitosamente desde la API');
      console.log('📊 Clientes:', clientesData.length);
      console.log('📦 Pedidos:', pedidosData.length);
      console.log('🛠️ Productos:', productosData.length);

    } catch (apiError: any) {
      console.error('❌ Error al cargar datos de la API:', apiError);
      setError('Error al cargar los datos del dashboard. Verificando conexión con el backend...');
      
      // Solo usar datos de demostración si hay un error de red específico
      if (apiError.code === 'ERR_NETWORK' || apiError.message?.includes('Network Error')) {
        console.warn('🌐 Error de red detectado, usando datos de demostración');
        
        // Datos de demostración mínimos
        setClientes([]);
        setPedidos([]);
        setProductos([]);
        setStats({
          totalClientes: 0,
          pedidosPendientes: 0,
          ventasHoy: 0
        });
      } else {
        // Para otros errores, mostrar el mensaje específico
        setError(`Error del servidor: ${apiError.response?.data?.message || apiError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleClienteCreated = () => {
    // Recargar la lista de clientes
    cargarDatos();
  };

  const handleOpenClienteRegistro = () => {
    setClienteRegistroOpen(true);
  };

  const handleCloseClienteRegistro = () => {
    setClienteRegistroOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⚙️</div>
        <p className="ml-4 text-lg">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Panel de Vendedor</h1>
        <p className="text-text-secondary mt-2">Gestiona clientes y pedidos</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-background border border-background rounded-lg">
          <p className="text-text-primary">{error}</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-primary/10 to-surface">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Total de Clientes
          </h3>
          <p className="text-3xl font-bold text-primary">
            {stats.totalClientes}
          </p>
          <p className="text-text-secondary mt-2">
            clientes registrados
          </p>
        </div>

        <div className="card bg-gradient-to-br from-accent-100 to-surface">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Pedidos Pendientes
          </h3>
          <p className="text-3xl font-bold text-accent-600">
            {stats.pedidosPendientes}
          </p>
          <p className="text-text-secondary mt-2">
            requieren atención
          </p>
        </div>

        <div className="card bg-gradient-to-br from-success-100 to-surface">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Ventas de Hoy
          </h3>
          <p className="text-3xl font-bold text-success-600">
            ${stats.ventasHoy?.toLocaleString() || '0'}
          </p>
          <p className="text-text-secondary mt-2">
            en ventas realizadas
          </p>
        </div>
      </div>

      {/* Clientes Recientes */}
      <section className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">
            Clientes Recientes
          </h2>
          <button
            onClick={handleOpenClienteRegistro}
            className="btn-primary"
          >
            + Registrar Nuevo Cliente
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background">
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Nombre</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">RUT</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Teléfono</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Estado</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length > 0 ? (
                clientes.slice(0, 5).map((cliente) => (
                  <tr key={cliente.id} className="border-b border-background">
                    <td className="px-4 py-3">
                      {cliente.nombre} {cliente.apellido}
                    </td>
                    <td className="px-4 py-3">{cliente.rut}</td>
                    <td className="px-4 py-3">{cliente.correoElectronico}</td>
                    <td className="px-4 py-3">{cliente.telefono || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-${cliente.activo ? 'success' : 'danger'}`}>
                        {cliente.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    No hay clientes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pedidos Recientes */}
      <section className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Pedidos Recientes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background">
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Cliente</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Fecha</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Total</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length > 0 ? (
                pedidos.slice(0, 5).map((pedido) => (
                  <tr key={pedido.id} className="border-b border-background">
                    <td className="px-4 py-3">#{pedido.id}</td>
                    <td className="px-4 py-3">{pedido.usuarioNombre || 'Cliente'}</td>
                    <td className="px-4 py-3">
                      {new Date(pedido.fechaCreacion).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">${pedido.total?.toLocaleString() || '0'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-${getEstadoColor(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    No hay pedidos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inventario Completo */}
      <section className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Inventario Completo
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background">
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Código</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Producto</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Stock</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos && productos.length > 0 ? (
                productos.map((producto) => (
                  <tr key={producto.id} className="border-b border-background">
                    <td className="px-4 py-3">{producto.codigo}</td>
                    <td className="px-4 py-3">{producto.nombre}</td>
                    <td className="px-4 py-3">{producto.stock}</td>
                    <td className="px-4 py-3">${producto.precio?.toLocaleString() || '0'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-secondary">
                    No hay productos en inventario
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pedidos Pendientes */}
      <section className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Pedidos Pendientes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background">
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Cliente</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Fecha</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Total</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Estado</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.filter(p => p.estado === 'PENDIENTE' || p.estado === 'EN_PROCESO').length > 0 ? (
                pedidos
                  .filter(p => p.estado === 'PENDIENTE' || p.estado === 'EN_PROCESO')
                  .map((pedido) => (
                    <tr key={pedido.id} className="border-b border-background">
                      <td className="px-4 py-3">#{pedido.id}</td>
                      <td className="px-4 py-3">{pedido.usuarioNombre || 'Cliente'}</td>
                      <td className="px-4 py-3">{new Date(pedido.fechaCreacion).toLocaleDateString()}</td>
                      <td className="px-4 py-3">${pedido.total?.toLocaleString() || '0'}</td>
                      <td className="px-4 py-3">
                        <span className={`badge-${getEstadoColor(pedido.estado)}`}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button className="btn-primary btn-xs" onClick={() => alert(`Aprobar pedido #${pedido.id}`)}>
                          Aprobar
                        </button>
                        <button className="btn-danger btn-xs" onClick={() => alert(`Rechazar pedido #${pedido.id}`)}>
                          Rechazar
                        </button>
                        <button className="btn-secondary btn-xs" onClick={() => alert(`Enviar a bodega pedido #${pedido.id}`)}>
                          Enviar a Bodega
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                    No hay pedidos pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gestión de Descuentos y Promociones */}
      <section className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Descuentos y Promociones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Descuentos Activos */}
          <div className="bg-gradient-to-br from-success-100 to-surface p-4 rounded-lg border border-success-200">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Descuentos Activos
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-surface rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-primary">Descuento 10% Herramientas</p>
                  <p className="text-sm text-text-secondary">Válido hasta: 31/12/2025</p>
                </div>
                <span className="badge-success">10%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-primary">Descuento $5.000 Pinturas</p>
                  <p className="text-sm text-text-secondary">Válido hasta: 15/07/2025</p>
                </div>
                <span className="badge-success">$5.000</span>
              </div>
            </div>
            <button className="btn-primary w-full mt-4">
              Gestionar Descuentos
            </button>
          </div>

          {/* Promociones Especiales */}
          <div className="bg-gradient-to-br from-accent-100 to-surface p-4 rounded-lg border border-accent-200">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Promociones Especiales
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-surface rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-primary">2x1 en Tornillos</p>
                  <p className="text-sm text-text-secondary">Compra 1, lleva 2</p>
                </div>
                <span className="badge-warning">2x1</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-primary">Envío Gratis</p>
                  <p className="text-sm text-text-secondary">Compras sobre $50.000</p>
                </div>
                <span className="badge-info">Gratis</span>
              </div>
            </div>
            <button className="btn-secondary w-full mt-4">
              Gestionar Promociones
            </button>
          </div>
        </div>
      </section>

      {/* Generación de Facturas */}
      <section className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Facturación
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-surface rounded-lg border border-primary-200">
            <div className="text-3xl font-bold text-primary mb-2">
              {pedidos.filter(p => p.estado === 'COMPLETADO').length}
            </div>
            <p className="text-text-secondary">Pedidos Completados</p>
            <button className="btn-primary btn-xs mt-2">
              Generar Facturas
            </button>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-success-100 to-surface rounded-lg border border-success-200">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {pedidos.filter(p => p.estado === 'PENDIENTE').length}
            </div>
            <p className="text-text-secondary">Pendientes de Facturar</p>
            <button className="btn-secondary btn-xs mt-2">
              Ver Detalles
            </button>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-accent-100 to-surface rounded-lg border border-accent-200">
            <div className="text-3xl font-bold text-accent-600 mb-2">
              ${pedidos.reduce((sum, p) => sum + (p.total || 0), 0).toLocaleString()}
            </div>
            <p className="text-text-secondary">Total Facturado</p>
            <button className="btn-secondary btn-xs mt-2">
              Reporte
            </button>
          </div>
        </div>
      </section>

      {/* Herramientas de Marketing */}
      <section className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Marketing y Campañas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Segmentación de Clientes */}
          <div className="bg-gradient-to-br from-accent-50 to-surface p-4 rounded-lg border border-accent-200">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Segmentación de Clientes
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Clientes Frecuentes</span>
                <span className="font-semibold text-primary">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Nuevos Clientes</span>
                <span className="font-semibold text-primary">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Clientes VIP</span>
                <span className="font-semibold text-primary">8</span>
              </div>
            </div>
            <button className="btn-primary w-full mt-4">
              Crear Campaña
            </button>
          </div>

          {/* Campañas Activas */}
          <div className="bg-gradient-to-br from-accent-100 to-surface p-4 rounded-lg border border-accent-200">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Campañas Activas
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-surface rounded-lg shadow-sm">
                <p className="font-medium text-primary">Campaña Verano</p>
                <p className="text-sm text-text-secondary">Descuentos en herramientas de jardín</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-text-secondary">15 días restantes</span>
                  <span className="badge-success">Activa</span>
                </div>
              </div>
              <div className="p-3 bg-surface rounded-lg shadow-sm">
                <p className="font-medium text-primary">Fidelización</p>
                <p className="text-sm text-text-secondary">Programa de puntos para clientes frecuentes</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-text-secondary">30 días restantes</span>
                  <span className="badge-success">Activa</span>
                </div>
              </div>
            </div>
            <button className="btn-secondary w-full mt-4">
              Gestionar Campañas
            </button>
          </div>
        </div>
      </section>

      {/* Componentes de ventas */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Panel de Vendedor
        </h1>
        <OpenCarritoButton onOpen={() => setCarritoOpen(true)} />
      </div>
      
      <GestionClientes />
      
      <Carrito 
        isOpen={carritoOpen}
        onClose={() => setCarritoOpen(false)}
        onCheckout={() => {
          setCarritoOpen(false);
          setCheckoutOpen(true);
        }}
      />
      
      <Checkout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      <ConfirmacionPedido
        isOpen={confirmacionOpen}
        onClose={handleCloseConfirmacion}
        pedido={pedidoConfirmado}
      />

      <ClienteRegistro
        isOpen={clienteRegistroOpen}
        onClose={handleCloseClienteRegistro}
        onClienteCreated={handleClienteCreated}
      />
    </div>
  );
};

const getEstadoColor = (estado: string): string => {
  switch (estado?.toUpperCase()) {
    case 'PENDIENTE':
      return 'warning';
    case 'EN_PROCESO':
      return 'info';
    case 'COMPLETADO':
      return 'success';
    case 'CANCELADO':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default VendedorView; 
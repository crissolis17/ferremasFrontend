import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Pedido, Producto } from '../types/api';

// Tipos adicionales para la funcionalidad del bodeguero
interface Ubicacion {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  productosAsignados: number;
}

interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  productos: number;
}

interface MovimientoInventario {
  id: number;
  productoId: number;
  productoNombre: string;
  tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  cantidad: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  motivo: string;
  fecha: string;
  usuario: string;
}

const BodegueroView: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'recepcion' | 'ajuste' | 'ubicacion'>('recepcion');

  // Estados para formularios
  const [formData, setFormData] = useState({
    cantidad: '',
    motivo: '',
    ubicacionId: '',
    proveedorId: ''
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [pedidosData, productosData] = await Promise.all([
          api.getPedidos(),
          api.getProductos()
        ]);
        setPedidos(pedidosData);
        setProductos(productosData);
        
        // Datos mock para demostración
        setUbicaciones([
          { id: 1, nombre: 'Estante A1', descripcion: 'Herramientas manuales', capacidad: 100, productosAsignados: 45 },
          { id: 2, nombre: 'Estante B2', descripcion: 'Materiales eléctricos', capacidad: 80, productosAsignados: 32 },
          { id: 3, nombre: 'Estante C3', descripcion: 'Plomería', capacidad: 120, productosAsignados: 78 },
          { id: 4, nombre: 'Estante D4', descripcion: 'Pinturas y accesorios', capacidad: 60, productosAsignados: 25 }
        ]);

        setProveedores([
          { id: 1, nombre: 'Ferretería Central', contacto: 'Juan Pérez', telefono: '+56 9 1234 5678', email: 'juan@ferreteria.cl', productos: 45 },
          { id: 2, nombre: 'Distribuidora Norte', contacto: 'María González', telefono: '+56 9 8765 4321', email: 'maria@distribuidora.cl', productos: 32 },
          { id: 3, nombre: 'Importadora Sur', contacto: 'Carlos López', telefono: '+56 9 5555 1234', email: 'carlos@importadora.cl', productos: 28 }
        ]);

        setMovimientos([
          { id: 1, productoId: 1, productoNombre: 'Martillo Stanley', tipo: 'ENTRADA', cantidad: 50, cantidadAnterior: 10, cantidadNueva: 60, motivo: 'Recepción de pedido #123', fecha: '2024-01-15', usuario: 'Bodeguero' },
          { id: 2, productoId: 2, productoNombre: 'Destornillador Phillips', tipo: 'SALIDA', cantidad: 5, cantidadAnterior: 25, cantidadNueva: 20, motivo: 'Venta #456', fecha: '2024-01-15', usuario: 'Vendedor' },
          { id: 3, productoId: 3, productoNombre: 'Cable Eléctrico', tipo: 'AJUSTE', cantidad: -2, cantidadAnterior: 15, cantidadNueva: 13, motivo: 'Ajuste por daño', fecha: '2024-01-14', usuario: 'Bodeguero' }
        ]);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⚙️</div>
      </div>
    );
  }

  const productosBajoStock = productos.filter(p => p.stock < 10);
  const productosAgotados = productos.filter(p => p.stock === 0);
  const pedidosPendientes = pedidos.filter(p => p.estado === 'PENDIENTE');

  const handleRecepcion = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalType('recepcion');
    setShowModal(true);
  };

  const handleAjuste = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalType('ajuste');
    setShowModal(true);
  };

  const handleUbicacion = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalType('ubicacion');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // Aquí iría la lógica para procesar el formulario
    console.log('Procesando:', modalType, formData);
    setShowModal(false);
    setFormData({ cantidad: '', motivo: '', ubicacionId: '', proveedorId: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ferremas-primary">Panel de Bodeguero</h1>
        <p className="text-ferremas-gray-600 mt-2">Gestión completa de inventario y almacén</p>
      </header>

      {/* Tabs de navegación */}
      <div className="border-b border-ferremas-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'inventario', label: 'Inventario', icon: '📦' },
            { id: 'ubicaciones', label: 'Ubicaciones', icon: '🗂️' },
            { id: 'proveedores', label: 'Proveedores', icon: '🏢' },
            { id: 'movimientos', label: 'Movimientos', icon: '📋' },
            { id: 'reportes', label: 'Reportes', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-ferremas-primary text-ferremas-primary'
                  : 'border-transparent text-ferremas-gray-500 hover:text-ferremas-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido del Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-ferremas-green-100 rounded-lg">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ferremas-gray-600">Total Productos</p>
                  <p className="text-2xl font-bold text-ferremas-primary">{productos.length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-ferremas-orange-100 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ferremas-gray-600">Bajo Stock</p>
                  <p className="text-2xl font-bold text-ferremas-orange-600">{productosBajoStock.length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">🚫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ferremas-gray-600">Agotados</p>
                  <p className="text-2xl font-bold text-red-600">{productosAgotados.length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-ferremas-blue-100 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-ferremas-gray-600">Pedidos Pendientes</p>
                  <p className="text-2xl font-bold text-ferremas-blue-600">{pedidosPendientes.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel de Pedidos Pendientes */}
            <section className="card">
              <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
                Pedidos Pendientes
              </h2>
              <div className="space-y-4">
                {pedidosPendientes.slice(0, 5).map((pedido) => (
                  <div 
                    key={pedido.id}
                    className="p-4 bg-white rounded-lg border border-ferremas-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pedido #{pedido.id}</span>
                      <span className="badge-warning">
                        {pedido.estado}
                      </span>
                    </div>
                    <div className="mt-2 text-ferremas-gray-600">
                      <p>Total: ${pedido.total.toFixed(2)}</p>
                      <p>Fecha: {new Date(pedido.fecha).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="btn-primary text-sm flex-1">
                        Recibir
                      </button>
                      <button className="btn-secondary text-sm flex-1">
                        Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary w-full mt-4">
                Ver Todos los Pedidos
              </button>
            </section>

            {/* Panel de Productos Bajo Stock */}
            <section className="card">
              <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
                Productos Bajo Stock
              </h2>
              <div className="space-y-4">
                {productosBajoStock.slice(0, 5).map((producto) => (
                  <div 
                    key={producto.id}
                    className="p-4 bg-white rounded-lg border border-ferremas-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{producto.nombre}</span>
                      <span className={`badge-${producto.stock === 0 ? 'danger' : 'warning'}`}>
                        Stock: {producto.stock}
                      </span>
                    </div>
                    <div className="mt-2 text-ferremas-gray-600">
                      <p>Código: {producto.codigo}</p>
                      <p>Ubicación: {producto.ubicacion}</p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => handleRecepcion(producto)}
                        className="btn-primary text-sm flex-1"
                      >
                        Recibir
                      </button>
                      <button 
                        onClick={() => handleAjuste(producto)}
                        className="btn-secondary text-sm flex-1"
                      >
                        Ajustar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary w-full mt-4">
                Ver Inventario Completo
              </button>
            </section>
          </div>
        </div>
      )}

      {/* Contenido del Inventario */}
      {activeTab === 'inventario' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-ferremas-primary">Gestión de Inventario</h2>
            <button className="btn-primary">
              <span className="mr-2">➕</span>
              Nuevo Producto
            </button>
          </div>

          {/* Filtros */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="text-sm font-medium text-ferremas-gray-700">Buscar</label>
                <input 
                  type="text" 
                  placeholder="Nombre o código..." 
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label className="text-sm font-medium text-ferremas-gray-700">Categoría</label>
                <select className="input-field">
                  <option value="">Todas</option>
                  <option value="herramientas">Herramientas</option>
                  <option value="electricos">Eléctricos</option>
                  <option value="plomeria">Plomería</option>
                </select>
              </div>
              <div className="form-group">
                <label className="text-sm font-medium text-ferremas-gray-700">Estado Stock</label>
                <select className="input-field">
                  <option value="">Todos</option>
                  <option value="bajo">Bajo Stock</option>
                  <option value="agotado">Agotado</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
              <div className="form-group">
                <label className="text-sm font-medium text-ferremas-gray-700">Ubicación</label>
                <select className="input-field">
                  <option value="">Todas</option>
                  {ubicaciones.map(ubicacion => (
                    <option key={ubicacion.id} value={ubicacion.id}>{ubicacion.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-ferremas-gray-200">
                <thead className="bg-ferremas-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-ferremas-gray-200">
                  {productos.slice(0, 10).map((producto) => (
                    <tr key={producto.id} className="hover:bg-ferremas-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-ferremas-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-ferremas-gray-600">
                                {producto.nombre.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-ferremas-primary">
                              {producto.nombre}
                            </div>
                            <div className="text-sm text-ferremas-gray-500">
                              {producto.categoria}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ferremas-gray-900">
                        {producto.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          producto.stock === 0 
                            ? 'bg-red-100 text-red-800' 
                            : producto.stock < 10 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {producto.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ferremas-gray-900">
                        {producto.ubicacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ferremas-gray-900">
                        ${producto.precio.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleRecepcion(producto)}
                            className="text-ferremas-primary hover:text-ferremas-gray-800"
                          >
                            📥
                          </button>
                          <button 
                            onClick={() => handleAjuste(producto)}
                            className="text-ferremas-orange-600 hover:text-ferremas-orange-800"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleUbicacion(producto)}
                            className="text-ferremas-blue-600 hover:text-ferremas-blue-800"
                          >
                            📍
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de Ubicaciones */}
      {activeTab === 'ubicaciones' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-ferremas-primary">Gestión de Ubicaciones</h2>
            <button className="btn-primary">
              <span className="mr-2">➕</span>
              Nueva Ubicación
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ubicaciones.map((ubicacion) => (
              <div key={ubicacion.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-ferremas-primary">{ubicacion.nombre}</h3>
                  <span className={`badge-${ubicacion.productosAsignados / ubicacion.capacidad > 0.8 ? 'warning' : 'success'}`}>
                    {Math.round((ubicacion.productosAsignados / ubicacion.capacidad) * 100)}%
                  </span>
                </div>
                <p className="text-ferremas-gray-600 mb-4">{ubicacion.descripcion}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-ferremas-gray-600">Productos:</span>
                    <span className="font-medium">{ubicacion.productosAsignados} / {ubicacion.capacidad}</span>
                  </div>
                  <div className="w-full bg-ferremas-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        ubicacion.productosAsignados / ubicacion.capacidad > 0.8 
                          ? 'bg-ferremas-orange-500' 
                          : 'bg-ferremas-green-500'
                      }`}
                      style={{ width: `${(ubicacion.productosAsignados / ubicacion.capacidad) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="btn-secondary text-sm flex-1">Ver Productos</button>
                  <button className="btn-primary text-sm flex-1">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de Proveedores */}
      {activeTab === 'proveedores' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-ferremas-primary">Gestión de Proveedores</h2>
            <button className="btn-primary">
              <span className="mr-2">➕</span>
              Nuevo Proveedor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proveedores.map((proveedor) => (
              <div key={proveedor.id} className="card">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-ferremas-blue-100 rounded-lg">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-ferremas-primary">{proveedor.nombre}</h3>
                    <p className="text-sm text-ferremas-gray-600">{proveedor.productos} productos</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ferremas-gray-600">Contacto:</span>
                    <span className="font-medium">{proveedor.contacto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ferremas-gray-600">Teléfono:</span>
                    <span className="font-medium">{proveedor.telefono}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ferremas-gray-600">Email:</span>
                    <span className="font-medium">{proveedor.email}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="btn-secondary text-sm flex-1">Ver Productos</button>
                  <button className="btn-primary text-sm flex-1">Contactar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de Movimientos */}
      {activeTab === 'movimientos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-ferremas-primary">Historial de Movimientos</h2>
            <div className="flex space-x-2">
              <button className="btn-secondary">Exportar</button>
              <button className="btn-primary">Nuevo Movimiento</button>
            </div>
          </div>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-ferremas-gray-200">
                <thead className="bg-ferremas-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Stock Final
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Motivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ferremas-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-ferremas-gray-200">
                  {movimientos.map((movimiento) => (
                    <tr key={movimiento.id} className="hover:bg-ferremas-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ferremas-gray-900">
                        {new Date(movimiento.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ferremas-primary">
                        {movimiento.productoNombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          movimiento.tipo === 'ENTRADA' 
                            ? 'bg-green-100 text-green-800'
                            : movimiento.tipo === 'SALIDA'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {movimiento.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ferremas-gray-900">
                        {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ferremas-gray-900">
                        {movimiento.cantidadNueva}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ferremas-gray-900">
                        {movimiento.motivo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ferremas-gray-900">
                        {movimiento.usuario}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de Reportes */}
      {activeTab === 'reportes' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-ferremas-primary">Reportes de Inventario</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reporte de Stock */}
            <div className="card">
              <h3 className="text-lg font-semibold text-ferremas-primary mb-4">Estado del Stock</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-ferremas-gray-600">Productos con stock normal</span>
                  <span className="font-bold text-ferremas-green-600">
                    {productos.filter(p => p.stock >= 10).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ferremas-gray-600">Productos bajo stock</span>
                  <span className="font-bold text-ferremas-orange-600">
                    {productosBajoStock.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ferremas-gray-600">Productos agotados</span>
                  <span className="font-bold text-red-600">
                    {productosAgotados.length}
                  </span>
                </div>
              </div>
              <button className="btn-primary w-full mt-4">Generar Reporte</button>
            </div>

            {/* Reporte de Valor */}
            <div className="card">
              <h3 className="text-lg font-semibold text-ferremas-primary mb-4">Valor del Inventario</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-ferremas-primary">
                    ${productos.reduce((total, p) => total + (p.precio * p.stock), 0).toLocaleString()}
                  </p>
                  <p className="text-ferremas-gray-600">Valor total en inventario</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-ferremas-green-600">
                    {productos.length}
                  </p>
                  <p className="text-ferremas-gray-600">Productos diferentes</p>
                </div>
              </div>
              <button className="btn-primary w-full mt-4">Exportar Reporte</button>
            </div>
          </div>

          {/* Gráfico de movimientos */}
          <div className="card">
            <h3 className="text-lg font-semibold text-ferremas-primary mb-4">Movimientos Recientes</h3>
            <div className="bg-ferremas-gray-50 p-8 rounded-lg text-center">
              <p className="text-ferremas-gray-600">Aquí irá el gráfico de movimientos de inventario</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal para acciones */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-ferremas-primary mb-4">
              {modalType === 'recepcion' && 'Recepción de Mercancía'}
              {modalType === 'ajuste' && 'Ajuste de Stock'}
              {modalType === 'ubicacion' && 'Cambiar Ubicación'}
            </h3>
            
            {selectedProducto && (
              <div className="mb-4 p-3 bg-ferremas-gray-50 rounded-lg">
                <p className="font-medium">{selectedProducto.nombre}</p>
                <p className="text-sm text-ferremas-gray-600">Stock actual: {selectedProducto.stock}</p>
              </div>
            )}

            <div className="space-y-4">
              {modalType === 'recepcion' && (
                <>
                  <div className="form-group">
                    <label className="text-sm font-medium text-ferremas-gray-700">Cantidad a recibir</label>
                    <input 
                      type="number" 
                      value={formData.cantidad}
                      onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-medium text-ferremas-gray-700">Proveedor</label>
                    <select 
                      value={formData.proveedorId}
                      onChange={(e) => setFormData({...formData, proveedorId: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Seleccionar proveedor</option>
                      {proveedores.map(proveedor => (
                        <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {modalType === 'ajuste' && (
                <>
                  <div className="form-group">
                    <label className="text-sm font-medium text-ferremas-gray-700">Cantidad de ajuste</label>
                    <input 
                      type="number" 
                      value={formData.cantidad}
                      onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                      className="input-field"
                      placeholder="0 (positivo para agregar, negativo para restar)"
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-medium text-ferremas-gray-700">Motivo</label>
                    <textarea 
                      value={formData.motivo}
                      onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                      className="input-field"
                      rows={3}
                      placeholder="Explicar el motivo del ajuste..."
                    />
                  </div>
                </>
              )}

              {modalType === 'ubicacion' && (
                <div className="form-group">
                  <label className="text-sm font-medium text-ferremas-gray-700">Nueva ubicación</label>
                  <select 
                    value={formData.ubicacionId}
                    onChange={(e) => setFormData({...formData, ubicacionId: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Seleccionar ubicación</option>
                    {ubicaciones.map(ubicacion => (
                      <option key={ubicacion.id} value={ubicacion.id}>{ubicacion.nombre}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                className="btn-primary"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodegueroView; 
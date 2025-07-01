import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ReporteVentas, ReporteInventario, UsuarioResponseDTO } from '../types/api';

const AdminView: React.FC = () => {
  const [reporteVentas, setReporteVentas] = useState<ReporteVentas | null>(null);
  const [reporteInventario, setReporteInventario] = useState<ReporteInventario | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const periodo = new Date().toISOString().slice(0, 7); // YYYY-MM
        const [ventasData, inventarioData] = await Promise.all([
          api.getReporteVentas(periodo),
          api.getReporteInventario()
        ]);
        setReporteVentas(ventasData);
        setReporteInventario(inventarioData);
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

  return (
    <div className="p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-ferremas-primary">Panel de Administración</h1>
      </header>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-ferremas-orange-50 to-white">
          <h3 className="text-lg font-semibold text-ferremas-primary mb-2">
            Ventas del Mes
          </h3>
          <p className="text-3xl font-bold text-ferremas-orange-600">
            ${reporteVentas?.totalVentas.toFixed(2)}
          </p>
          <p className="text-ferremas-gray-600 mt-2">
            {reporteVentas?.cantidadVentas} ventas realizadas
          </p>
        </div>

        <div className="card bg-gradient-to-br from-ferremas-green-50 to-white">
          <h3 className="text-lg font-semibold text-ferremas-primary mb-2">
            Valor de Inventario
          </h3>
          <p className="text-3xl font-bold text-ferremas-green-600">
            ${reporteInventario?.valorTotal.toFixed(2)}
          </p>
          <p className="text-ferremas-gray-600 mt-2">
            {reporteInventario?.totalProductos} productos en stock
          </p>
        </div>

        <div className="card bg-gradient-to-br from-ferremas-gray-50 to-white">
          <h3 className="text-lg font-semibold text-ferremas-primary mb-2">
            Productos Agotados
          </h3>
          <p className="text-3xl font-bold text-ferremas-danger">
            {reporteInventario?.productosAgotados}
          </p>
          <p className="text-ferremas-gray-600 mt-2">
            productos requieren atención
          </p>
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <section className="card">
        <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
          Productos Más Vendidos
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-ferremas-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-ferremas-gray-600">Producto</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-ferremas-gray-600">Cantidad</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-ferremas-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {reporteVentas?.productosVendidos.map((producto) => (
                <tr key={producto.productoId} className="border-b border-ferremas-gray-100">
                  <td className="px-4 py-3">{producto.nombre}</td>
                  <td className="px-4 py-3">{producto.cantidad}</td>
                  <td className="px-4 py-3">${producto.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Productos Bajo Stock */}
      <section className="card">
        <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
          Productos Bajo Stock
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-ferremas-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-ferremas-gray-600">Código</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-ferremas-gray-600">Producto</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-ferremas-gray-600">Stock</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-ferremas-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reporteInventario?.productosBajoStock.map((producto) => (
                <tr key={producto.id} className="border-b border-ferremas-gray-100">
                  <td className="px-4 py-3">{producto.codigo}</td>
                  <td className="px-4 py-3">{producto.nombre}</td>
                  <td className="px-4 py-3">{producto.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`badge-${producto.stock === 0 ? 'danger' : 'warning'}`}>
                      {producto.stock === 0 ? 'Agotado' : 'Bajo Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="card">
          <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
            Acciones Rápidas
          </h2>
          <div className="space-y-4">
            <button className="btn-primary w-full">
              Generar Reporte de Ventas
            </button>
            <button className="btn-primary w-full">
              Gestionar Usuarios
            </button>
            <button className="btn-primary w-full">
              Configurar Sistema
            </button>
          </div>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
            Notificaciones del Sistema
          </h2>
          <div className="space-y-2">
            <div className="p-3 bg-ferremas-orange-50 text-ferremas-orange-800 rounded-lg">
              ⚠️ {reporteInventario?.productosAgotados} productos requieren reposición
            </div>
            <div className="p-3 bg-ferremas-green-50 text-ferremas-green-800 rounded-lg">
              ✅ Sistema funcionando correctamente
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminView; 
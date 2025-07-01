import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Venta, Producto } from '../types/api';

const VendedorView: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [ventasData, productosData] = await Promise.all([
          api.getVentas(),
          api.getProductos()
        ]);
        setVentas(ventasData);
        setProductos(productosData);
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
        <h1 className="text-2xl font-bold text-ferremas-primary">Panel de Vendedor</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de Ventas Recientes */}
        <section className="card">
          <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
            Ventas Recientes
          </h2>
          <div className="space-y-4">
            {ventas.slice(0, 5).map((venta) => (
              <div 
                key={venta.id}
                className="p-4 bg-white rounded-lg border border-ferremas-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Venta #{venta.id}</span>
                  <span className={`badge-${venta.estado.toLowerCase()}`}>
                    {venta.estado}
                  </span>
                </div>
                <div className="mt-2 text-ferremas-gray-600">
                  <p>Total: ${venta.total.toFixed(2)}</p>
                  <p>Fecha: {new Date(venta.fecha).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full mt-4">
            Ver Todas las Ventas
          </button>
        </section>

        {/* Panel de Productos */}
        <section className="card">
          <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
            Productos Disponibles
          </h2>
          <div className="space-y-4">
            {productos.slice(0, 5).map((producto) => (
              <div 
                key={producto.id}
                className="p-4 bg-white rounded-lg border border-ferremas-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{producto.nombre}</span>
                  <span className={`badge-${producto.stock > 0 ? 'success' : 'danger'}`}>
                    Stock: {producto.stock}
                  </span>
                </div>
                <div className="mt-2 text-ferremas-gray-600">
                  <p>Código: {producto.codigo}</p>
                  <p>Precio: ${producto.precio.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full mt-4">
            Ver Catálogo Completo
          </button>
        </section>
      </div>

      {/* Panel de Nueva Venta */}
      <section className="card mt-6">
        <h2 className="text-xl font-semibold text-ferremas-primary mb-4">
          Registrar Nueva Venta
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="text-sm font-medium text-ferremas-gray-700">
              Cliente
            </label>
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="text-sm font-medium text-ferremas-gray-700">
              Producto
            </label>
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="input-field"
            />
          </div>
        </div>
        <button className="btn-primary mt-4">
          Iniciar Nueva Venta
        </button>
      </section>
    </div>
  );
};

export default VendedorView; 
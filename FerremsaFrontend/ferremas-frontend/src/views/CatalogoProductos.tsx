import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApiClient } from '../services/api';
import type { ProductoResponseDTO } from '../types/api';
import AddToCartButton from '../components/ui/AddToCartButton';
import Carrito from '../components/sales/Carrito';
import CarritoButton from '../components/ui/CarritoButton';
import { useAuth } from '../context/AuthContext';

const CatalogoProductos: React.FC = () => {
  const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<ProductoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('nombre');
  
  // Estados para el carrito
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProductos = async () => {
      console.log('1. Iniciando fetch de productos...');
      setLoading(true);
      setError(null);
      try {
        const response = await publicApiClient.get<any>('/api/Productos');
        console.log('2. Respuesta recibida del backend:', response);
        
        const productosData = response.data.productos || response.data.datos || response.data.Datos || response.data.Productos || response.data || [];
        console.log('3. Datos de productos extraídos:', productosData);

        if (Array.isArray(productosData)) {
            setProductos(productosData);
            setProductosFiltrados(productosData);
            if (productosData.length === 0) {
              console.warn('4. No hay productos disponibles en la respuesta.');
            } else {
              console.log('4. Productos cargados en el estado.');
            }
        } else {
            throw new Error("La respuesta no contiene un array de productos válido.");
        }

      } catch (err: any) {
        console.error('Error en el bloque try-catch:', err);
        setError('No se pudieron cargar los productos. Revisa la consola para más detalles.');
      } finally {
        console.log('5. Finalizando fetch, setLoading a false.');
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Filtrar productos cuando cambien los filtros
  useEffect(() => {
    let filtrados = [...productos];

    // Filtro por búsqueda
    if (busqueda) {
      filtrados = filtrados.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro por categoría
    if (categoriaFiltro) {
      filtrados = filtrados.filter(producto =>
        producto.categoriaNombre === categoriaFiltro
      );
    }

    // Filtro por precio mínimo
    if (precioMin) {
      filtrados = filtrados.filter(producto =>
        producto.precio >= parseFloat(precioMin)
      );
    }

    // Filtro por precio máximo
    if (precioMax) {
      filtrados = filtrados.filter(producto =>
        producto.precio <= parseFloat(precioMax)
      );
    }

    // Ordenar productos
    filtrados.sort((a, b) => {
      switch (ordenarPor) {
        case 'precio-asc':
          return a.precio - b.precio;
        case 'precio-desc':
          return b.precio - a.precio;
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setProductosFiltrados(filtrados);
  }, [productos, busqueda, categoriaFiltro, precioMin, precioMax, ordenarPor]);

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map(p => p.categoriaNombre).filter(Boolean))].sort();

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaFiltro('');
    setPrecioMin('');
    setPrecioMax('');
    setOrdenarPor('nombre');
  };

  const handleProductoAgregado = () => {
    // Aquí podrías actualizar el contador del carrito si es necesario
    console.log('Producto agregado al carrito');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loading-spinner h-12 w-12 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Cargando productos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="empty-state">
      <div className="empty-state-icon">⚠️</div>
      <h3 className="empty-state-title">Error al cargar productos</h3>
      <p className="empty-state-description">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!isAuthenticated && (
        <div className="bg-primary text-white rounded-2xl p-8 mb-8 shadow-vibrant flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">¡Únete a Ferremas!</h2>
            <p className="text-white text-opacity-90 max-w-xl">Regístrate gratis y disfruta de descuentos exclusivos, envío gratis en compras sobre $50.000 y mucho más.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto justify-center md:justify-end">
            <Link
              to="/registro"
              className="btn-accent text-base px-8 py-2"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-base px-8 py-2"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      )}

      {/* Header con título y carrito */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-ferremas-primary">Catálogo de Productos</h1>
        <CarritoButton onClick={() => setCarritoAbierto(true)} />
      </div>

      {/* Filtros y búsqueda */}
      <div className="filters-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar productos
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre, descripción o código..."
              className="input-field focus-ring"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="input-field focus-ring"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          {/* Filtro por precio mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio mínimo
            </label>
            <input
              type="number"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              placeholder="0"
              className="input-field focus-ring"
            />
          </div>

          {/* Filtro por precio máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio máximo
            </label>
            <input
              type="number"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              placeholder="Sin límite"
              className="input-field focus-ring"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="input-field focus-ring"
            >
              <option value="nombre">Nombre</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="stock">Stock</option>
            </select>
          </div>

          <button
            onClick={limpiarFiltros}
            className="text-ferremas-primary hover:text-ferremas-primary-dark font-medium transition-colors duration-200"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <p className="text-gray-600">
          Mostrando {productosFiltrados.length} de {productos.length} productos
        </p>
      </div>

      {/* Grid de productos */}
      {productosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No se encontraron productos</h3>
          <p className="empty-state-description">Intenta ajustar los filtros de búsqueda</p>
          <button
            onClick={limpiarFiltros}
            className="btn-primary"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {productosFiltrados.map(producto => (
            <div key={producto.id} className="product-card">
              <Link to={`/producto/${producto.id}`} className="block">
                <div className="relative">
                  <img
                    src={producto.imagenUrl || '/placeholder.png'}
                    alt={producto.nombre}
                    className="product-image"
                    onError={e => {
                      if (e.currentTarget.src.includes('placeholder.png')) {
                        e.currentTarget.onerror = null;
                        return;
                      }
                      e.currentTarget.src = '/placeholder.png';
                    }}
                  />
                  {producto.stock === 0 && (
                    <div className="stock-status stock-out">
                      Agotado
                    </div>
                  )}
                  {producto.stock > 0 && producto.stock <= 5 && (
                    <div className="stock-status stock-low">
                      Últimas {producto.stock}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">{producto.nombre}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-ferremas-primary font-bold text-xl">
                      ${producto.precio.toLocaleString('es-CL')}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {producto.stock}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <span className="badge-primary">{producto.categoriaNombre || 'Sin categoría'}</span>
                  </div>
                </div>
              </Link>

              {/* Botón agregar al carrito */}
              <div className="px-4 pb-4">
                <AddToCartButton
                  productoId={producto.id}
                  productoNombre={producto.nombre}
                  stockDisponible={producto.stock}
                  onSuccess={handleProductoAgregado}
                  className="add-to-cart-btn"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carrito modal */}
      <Carrito
        isOpen={carritoAbierto}
        onClose={() => setCarritoAbierto(false)}
        onCheckout={() => {
          setCarritoAbierto(false);
          setCheckoutAbierto(true);
        }}
      />
    </div>
  );
};

export default CatalogoProductos; 
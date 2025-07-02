import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { ProductoResponseDTO } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import AddToCartButton from '../../components/ui/AddToCartButton';
import CarritoButton from '../../components/ui/CarritoButton';
import Carrito from '../../components/sales/Carrito';

const ProductoDetalle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();
    const [producto, setProducto] = useState<ProductoResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [checkoutAbierto, setCheckoutAbierto] = useState(false);

    useEffect(() => {
        const fetchProducto = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const fetchedProducto = await api.getProductoById(parseInt(id, 10));
                setProducto(fetchedProducto);
                setError(null);
            } catch (err) {
                setError('Error al cargar el producto.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    const handleProductoAgregado = () => {
        console.log('Producto agregado al carrito');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ferremas-primary mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center py-16">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Error al cargar el producto</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/catalogo" className="btn-primary">
                        Volver al Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center py-16">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Producto no encontrado</h2>
                    <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido removido.</p>
                    <Link to="/catalogo" className="btn-primary">
                        Volver al Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header con navegación */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <Link 
                        to="/catalogo" 
                        className="text-ferremas-primary hover:text-ferremas-primary-dark font-medium"
                    >
                        ← Volver al Catálogo
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{producto.nombre}</span>
                </div>
                <CarritoButton onClick={() => setCarritoAbierto(true)} />
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Columna izquierda - Imagen */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <img 
                            src={producto.imagenUrl || '/placeholder.png'} 
                            alt={producto.nombre} 
                            className="w-full h-96 object-cover"
                            onError={e => {
                                if (e.currentTarget.src.includes('placeholder.png')) {
                                    e.currentTarget.onerror = null;
                                    return;
                                }
                                e.currentTarget.src = '/placeholder.png';
                            }}
                        />
                    </div>
                    
                    {/* Información adicional */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Información del Producto</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Código:</span>
                                <span className="font-medium">{producto.codigo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Categoría:</span>
                                <span className="font-medium">{producto.categoriaNombre || 'Sin categoría'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Marca:</span>
                                <span className="font-medium">{producto.marcaNombre || 'Sin marca'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Estado:</span>
                                <span className={`font-medium ${producto.activo ? 'text-green-600' : 'text-red-600'}`}>
                                    {producto.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha - Información del producto */}
                <div className="space-y-6">
                    {/* Información básica */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{producto.nombre}</h1>
                        
                        <div className="mb-6">
                            <p className="text-gray-600 text-lg leading-relaxed">{producto.descripcion}</p>
                        </div>

                        {/* Precio */}
                        <div className="mb-6">
                            <div className="text-4xl font-bold text-ferremas-primary">
                                ${producto.precio.toLocaleString('es-CL')}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Precio incluye IVA</p>
                        </div>

                        {/* Stock */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600">Stock disponible:</span>
                                <span className={`font-semibold ${
                                    producto.stock === 0 ? 'text-red-600' : 
                                    producto.stock <= 5 ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                    {producto.stock} unidades
                                </span>
                            </div>
                            
                            {producto.stock === 0 && (
                                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">
                                        ⚠️ Este producto está agotado. Contacta con nosotros para más información.
                                    </p>
                                </div>
                            )}
                            
                            {producto.stock > 0 && producto.stock <= 5 && (
                                <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <p className="text-orange-700 text-sm">
                                        ⚡ ¡Solo quedan {producto.stock} unidades! Aprovecha antes de que se agoten.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Especificaciones */}
                        {producto.especificaciones && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Especificaciones</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-line">{producto.especificaciones}</p>
                                </div>
                            </div>
                        )}

                        {/* Botón agregar al carrito */}
                        <div className="space-y-4">
                            {!isAuthenticated ? (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-blue-700 text-sm mb-3">
                                        🔐 Para agregar productos al carrito, debes iniciar sesión.
                                    </p>
                                    <Link to="/login" className="btn-primary">
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            ) : (
                                <AddToCartButton
                                    productoId={producto.id}
                                    productoNombre={producto.nombre}
                                    stockDisponible={producto.stock}
                                    onSuccess={handleProductoAgregado}
                                    className="w-full text-lg py-4"
                                />
                            )}
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Información de Envío</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <span>🚚</span>
                                <span>Envío disponible en todo Chile</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>⏰</span>
                                <span>Entrega en 2-5 días hábiles</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🔄</span>
                                <span>Devolución gratuita en 30 días</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>💳</span>
                                <span>Múltiples métodos de pago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

export default ProductoDetalle; 
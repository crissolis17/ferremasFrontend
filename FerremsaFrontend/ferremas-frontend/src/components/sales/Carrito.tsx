import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { CarritoItemDTO, CarritoResumenDTO } from '../../types/api';
import ConfirmDialog from '../ui/ConfirmDialog';
import Notification from '../ui/Notification';

interface CarritoProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Carrito: React.FC<CarritoProps> = ({ isOpen, onClose, onCheckout }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CarritoItemDTO[]>([]);
  const [resumen, setResumen] = useState<CarritoResumenDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para confirmación y notificaciones
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    item: CarritoItemDTO | null;
    action: 'delete' | 'clear';
  }>({ isOpen: false, item: null, action: 'delete' });
  
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  }>({ isOpen: false, type: 'info', title: '' });

  const fetchCarrito = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para ver tu carrito');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const itemsData = await api.getCarrito();
      // Si tienes un método para obtener el resumen, agrégalo aquí
      let resumenData: CarritoResumenDTO | null = null;
      if (api.getCarritoResumen) {
        resumenData = await api.getCarritoResumen();
      }
      setItems(itemsData || []);
      setResumen(resumenData || null);
    } catch (err) {
      setError('No se pudo cargar el carrito');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCarrito();
    }
  }, [isOpen, isAuthenticated]);

  const handleActualizarCantidad = async (item: CarritoItemDTO, nuevaCantidad: number) => {
    if (!isAuthenticated) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'Inicia sesión',
        message: 'Debes iniciar sesión para modificar el carrito'
      });
      return;
    }

    try {
      setUpdatingItem(item.id);
      if (api.actualizarCantidadCarrito) {
        await api.actualizarCantidadCarrito(item.id, nuevaCantidad);
      } else {
        // Si no tienes el método, deberías implementarlo en api.ts
        throw new Error('Método actualizarCantidadCarrito no implementado');
      }
      await fetchCarrito();
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Cantidad actualizada',
        message: 'La cantidad ha sido actualizada correctamente.'
      });
    } catch (err: any) {
      const errorMessage = err.response?.data || 'Error al actualizar la cantidad';
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleEliminarItem = (item: CarritoItemDTO) => {
    if (!isAuthenticated) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'Inicia sesión',
        message: 'Debes iniciar sesión para modificar el carrito'
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      item: item,
      action: 'delete'
    });
  };

  const handleLimpiarCarrito = () => {
    if (!isAuthenticated) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'Inicia sesión',
        message: 'Debes iniciar sesión para modificar el carrito'
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      item: null,
      action: 'clear'
    });
  };

  const confirmEliminarItem = async () => {
    const item = confirmDialog.item;
    if (!item) return;

    try {
      if (api.eliminarItemCarrito) {
        await api.eliminarItemCarrito(item.id);
      } else {
        // Si no tienes el método, deberías implementarlo en api.ts
        throw new Error('Método eliminarItemCarrito no implementado');
      }
      await fetchCarrito();
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Producto eliminado',
        message: 'El producto ha sido eliminado del carrito.'
      });
    } catch (err: any) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'No se pudo eliminar el producto del carrito.'
      });
    }
  };

  const confirmLimpiarCarrito = async () => {
    try {
      if (api.limpiarCarrito) {
        await api.limpiarCarrito();
      } else {
        // Si no tienes el método, deberías implementarlo en api.ts
        throw new Error('Método limpiarCarrito no implementado');
      }
      await fetchCarrito();
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Carrito limpiado',
        message: 'El carrito ha sido limpiado correctamente.'
      });
    } catch (err: any) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'No se pudo limpiar el carrito.'
      });
    }
  };

  const handleConfirmAction = () => {
    if (confirmDialog.action === 'delete') {
      confirmEliminarItem();
    } else if (confirmDialog.action === 'clear') {
      confirmLimpiarCarrito();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-ferremas-primary">
            🛒 Carrito de Compras
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Debes iniciar sesión para ver tu carrito</p>
            <button 
              onClick={onClose}
              className="btn-primary"
            >
              Cerrar
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <p>Cargando carrito...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchCarrito}
              className="btn-primary mt-4"
            >
              Reintentar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
            <button 
              onClick={onClose}
              className="btn-primary"
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex items-center p-4 border rounded-lg">
                  <img
                    src={item.productoImagen || '/placeholder.png'}
                    alt={item.productoNombre}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{item.productoNombre}</h3>
                    <p className="text-gray-600">${item.productoPrecio.toLocaleString('es-CL')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleActualizarCantidad(item, item.cantidad - 1)}
                      disabled={updatingItem === item.id || item.cantidad <= 1}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => handleActualizarCantidad(item, item.cantidad + 1)}
                      disabled={updatingItem === item.id}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold">${item.subtotal.toLocaleString('es-CL')}</p>
                    <button
                      onClick={() => handleEliminarItem(item)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            {resumen && (
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal:</span>
                  <span>${resumen.subtotal?.toLocaleString('es-CL') || '0'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Envío:</span>
                  <span>${resumen.costoEnvio?.toLocaleString('es-CL') || '0'}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>${resumen.total?.toLocaleString('es-CL') || '0'}</span>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleLimpiarCarrito}
                className="btn-secondary"
              >
                Limpiar carrito
              </button>
              <button
                onClick={onCheckout}
                className="btn-primary"
              >
                Proceder al checkout
              </button>
            </div>
          </>
        )}

        {/* Diálogo de confirmación */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={handleConfirmAction}
          title={
            confirmDialog.action === 'delete' 
              ? 'Eliminar producto' 
              : 'Limpiar carrito'
          }
          message={
            confirmDialog.action === 'delete'
              ? `¿Estás seguro de que quieres eliminar "${confirmDialog.item?.productoNombre}" del carrito?`
              : '¿Estás seguro de que quieres limpiar todo el carrito?'
          }
        />

        {/* Notificaciones */}
        <Notification
          isOpen={notification.isOpen}
          onClose={() => setNotification({ ...notification, isOpen: false })}
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
      </div>
    </div>
  );
};

export default Carrito; 
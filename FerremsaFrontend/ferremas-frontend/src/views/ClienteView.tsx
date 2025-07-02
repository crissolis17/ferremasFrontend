import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Venta, FacturaResponseDTO } from '../types/api';

const ClienteView: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [facturas, setFacturas] = useState<FacturaResponseDTO[]>([]);
  const currentUser = JSON.parse(localStorage.getItem('ferremas_user') || '{}');

  useEffect(() => {
    setEditData({ nombre: currentUser.nombre || '', email: currentUser.email || '', password: '', confirmPassword: '' });
    const fetchVentas = async () => {
      try {
        const data = await api.getVentas();
        const ventasCliente = data.filter((v: Venta) => v.clienteId === currentUser.id);
        setVentas(ventasCliente);
      } catch (err) {
        setError('No se pudieron cargar las ventas.');
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, [currentUser.id, currentUser.nombre, currentUser.email]);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const data = await api.getFacturas();
        const facturasCliente = data.filter((f: FacturaResponseDTO) => {
          return true;
        });
        setFacturas(facturasCliente);
      } catch (err) {
        // No es crítico, solo no mostrar facturas
      }
    };
    fetchFacturas();
  }, [currentUser.id]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccess(null);
    setEditError(null);
    if (editData.password && editData.password !== editData.confirmPassword) {
      setEditError('Las contraseñas no coinciden.');
      setEditLoading(false);
      return;
    }
    try {
      await api.updateUsuario(currentUser.id, {
        nombre: editData.nombre,
        email: editData.email,
        password: editData.password || undefined,
      });
      setEditSuccess('Perfil actualizado correctamente.');
      // Actualizar datos en localStorage
      localStorage.setItem('ferremas_user', JSON.stringify({ ...currentUser, nombre: editData.nombre, email: editData.email }));
      setTimeout(() => setShowEditModal(false), 1200);
    } catch (err: any) {
      setEditError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-4xl">⚙️</div></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-ferremas-primary">Bienvenido, {currentUser.nombre}</h1>
        <p className="text-ferremas-gray-600">Este es tu panel de cliente. Aquí puedes ver tus compras recientes y tu información básica.</p>
      </header>

      {/* Sección de perfil */}
      <section className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ferremas-primary mb-1">Mi Perfil</h2>
            <p className="text-ferremas-gray-600">Nombre: <span className="font-medium">{currentUser.nombre}</span></p>
            <p className="text-ferremas-gray-600">Correo: <span className="font-medium">{currentUser.email}</span></p>
          </div>
          <button className="btn-primary" onClick={() => setShowEditModal(true)}>
            Editar Perfil
          </button>
        </div>
      </section>

      {/* Modal de edición de perfil */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-ferremas-gray-400 hover:text-ferremas-primary" onClick={() => setShowEditModal(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-4 text-ferremas-primary">Editar Perfil</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" name="nombre" value={editData.nombre} onChange={handleEditChange} className="input-field w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Correo</label>
                <input type="email" name="email" value={editData.email} onChange={handleEditChange} className="input-field w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
                <input type="password" name="password" value={editData.password} onChange={handleEditChange} className="input-field w-full" minLength={6} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
                <input type="password" name="confirmPassword" value={editData.confirmPassword} onChange={handleEditChange} className="input-field w-full" minLength={6} />
              </div>
              {editError && <div className="text-red-600 text-sm">{editError}</div>}
              {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
              <button type="submit" className="btn-primary w-full" disabled={editLoading}>
                {editLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="card">
        <h2 className="text-xl font-semibold text-ferremas-primary mb-4">Tus Compras Recientes</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {ventas.length === 0 ? (
          <p className="text-ferremas-gray-600">No tienes compras recientes.</p>
        ) : (
          <div className="space-y-4">
            {ventas.slice(0, 5).map((venta) => (
              <div key={venta.id} className="p-4 bg-white rounded-lg border border-ferremas-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Venta #{venta.id}</span>
                  <span className={`badge-${venta.estado.toLowerCase()}`}>{venta.estado}</span>
                </div>
                <div className="mt-2 text-ferremas-gray-600">
                  <p>Total: ${venta.total.toFixed(2)}</p>
                  <p>Fecha: {new Date(venta.fecha).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Historial de facturas */}
      <section className="card mt-6">
        <h2 className="text-xl font-semibold text-ferremas-primary mb-4">Historial de Facturas</h2>
        {facturas.length === 0 ? (
          <p className="text-ferremas-gray-600">No tienes facturas emitidas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Monto</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td className="px-4 py-2">{factura.id}</td>
                    <td className="px-4 py-2">{new Date(factura.fechaEmision).toLocaleDateString()}</td>
                    <td className="px-4 py-2">${factura.montoTotal.toFixed(2)}</td>
                    <td className="px-4 py-2">{factura.anulada ? 'Anulada' : 'Vigente'}</td>
                    <td className="px-4 py-2">
                      <button
                        className="btn-secondary"
                        onClick={async () => {
                          try {
                            const blob = await api.descargarComprobanteFactura(factura.id);
                            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `Factura_${factura.id}.pdf`);
                            document.body.appendChild(link);
                            link.click();
                            link.parentNode?.removeChild(link);
                          } catch (err) {
                            alert('No se pudo descargar el comprobante');
                          }
                        }}
                      >
                        Descargar comprobante
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ClienteView; 
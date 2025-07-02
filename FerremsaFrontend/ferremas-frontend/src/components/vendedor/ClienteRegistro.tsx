import React, { useState } from 'react';
import { apiClient } from '../../services/api';
import type { ClienteCreateDTO, DireccionDTO } from '../../types/api';
import Notification from '../ui/Notification';
import { regionesYComunas } from '../../utils/formatters';

interface ClienteRegistroProps {
  isOpen: boolean;
  onClose: () => void;
  onClienteCreated: () => void;
}

const ClienteRegistro: React.FC<ClienteRegistroProps> = ({ isOpen, onClose, onClienteCreated }) => {
  const [formData, setFormData] = useState<ClienteCreateDTO>({
    nombre: '',
    apellido: '',
    rut: '',
    correoElectronico: '',
    telefono: '',
    direcciones: [{
      calle: '',
      numero: '',
      departamento: '',
      comuna: '',
      region: '',
      codigoPostal: '',
      esPrincipal: true
    }]
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  }>({ isOpen: false, type: 'info', title: '' });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    let newValue = value;
    if (field === 'rut') {
      newValue = value.replace(/\./g, '');
    }
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDireccionChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      direcciones: prev.direcciones.map((dir, i) => 
        i === index ? { ...dir, [field]: value } : dir
      )
    }));
  };

  const addDireccion = () => {
    setFormData(prev => ({
      ...prev,
      direcciones: [...prev.direcciones, {
        calle: '',
        numero: '',
        departamento: '',
        comuna: '',
        region: '',
        codigoPostal: '',
        esPrincipal: false
      }]
    }));
  };

  const removeDireccion = (index: number) => {
    if (formData.direcciones.length > 1) {
      setFormData(prev => ({
        ...prev,
        direcciones: prev.direcciones.filter((_, i) => i !== index)
      }));
    }
  };

  const setDireccionPrincipal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      direcciones: prev.direcciones.map((dir, i) => ({
        ...dir,
        esPrincipal: i === index
      }))
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar campos obligatorios
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.rut.trim()) newErrors.rut = 'El RUT es obligatorio';
    if (!formData.correoElectronico.trim()) newErrors.correoElectronico = 'El email es obligatorio';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      newErrors.correoElectronico = 'Formato de email inválido';
    }

    // Validar RUT chileno
    const rutRegex = /^\d{7,8}-[\dkK]$/;
    if (formData.rut && !rutRegex.test(formData.rut)) {
      newErrors.rut = 'Formato de RUT inválido (ej: 12345678-9)';
    }

    // Validar direcciones
    formData.direcciones.forEach((dir, index) => {
      if (!dir.calle.trim()) newErrors[`direccion_${index}_calle`] = 'La calle es obligatoria';
      if (!dir.numero.trim()) newErrors[`direccion_${index}_numero`] = 'El número es obligatorio';
      if (!dir.comuna.trim()) newErrors[`direccion_${index}_comuna`] = 'La comuna es obligatoria';
      if (!dir.region.trim()) newErrors[`direccion_${index}_region`] = 'La región es obligatoria';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error de validación',
        message: 'Por favor, corrige los errores en el formulario.'
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiClient.post('/api/Clientes', formData);
      
      if (response.data) {
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Cliente registrado exitosamente',
          message: `El cliente ${formData.nombre} ${formData.apellido} ha sido registrado correctamente.`
        });
        
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          rut: '',
          correoElectronico: '',
          telefono: '',
          direcciones: [{
            calle: '',
            numero: '',
            departamento: '',
            comuna: '',
            region: '',
            codigoPostal: '',
            esPrincipal: true
          }]
        });
        
        // Notificar al componente padre
        onClienteCreated();
        
        // Cerrar modal después de un breve delay
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error al registrar cliente:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.join(', ') || 
                          'Error al registrar el cliente';
      
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error al registrar',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        {/* Modal */}
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-ferremas-gray-200">
            <h2 className="text-2xl font-bold text-ferremas-primary">
              Registrar Nuevo Cliente
            </h2>
            <button
              onClick={onClose}
              className="text-ferremas-gray-400 hover:text-ferremas-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información Personal */}
            <div className="card">
              <h3 className="text-lg font-semibold text-ferremas-primary mb-4">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className={`input-field ${errors.nombre ? 'input-error' : ''}`}
                    placeholder="Ingrese el nombre"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    className={`input-field ${errors.apellido ? 'input-error' : ''}`}
                    placeholder="Ingrese el apellido"
                  />
                  {errors.apellido && (
                    <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                    RUT *
                  </label>
                  <input
                    type="text"
                    value={formData.rut}
                    onChange={(e) => handleInputChange('rut', e.target.value)}
                    className={`input-field ${errors.rut ? 'input-error' : ''}`}
                    placeholder="12345678-9"
                  />
                  {errors.rut && (
                    <p className="text-red-500 text-sm mt-1">{errors.rut}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className={`input-field ${errors.telefono ? 'input-error' : ''}`}
                    placeholder="+56912345678"
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.correoElectronico}
                    onChange={(e) => handleInputChange('correoElectronico', e.target.value)}
                    className={`input-field ${errors.correoElectronico ? 'input-error' : ''}`}
                    placeholder="cliente@email.com"
                  />
                  {errors.correoElectronico && (
                    <p className="text-red-500 text-sm mt-1">{errors.correoElectronico}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Direcciones */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-ferremas-primary">
                  Direcciones de Envío
                </h3>
                <button
                  type="button"
                  onClick={addDireccion}
                  className="btn-secondary btn-xs"
                >
                  + Agregar Dirección
                </button>
              </div>

              {formData.direcciones.map((direccion, index) => (
                <div key={index} className="border border-ferremas-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-ferremas-primary">
                      Dirección {index + 1}
                      {direccion.esPrincipal && (
                        <span className="badge-success ml-2">Principal</span>
                      )}
                    </h4>
                    <div className="flex space-x-2">
                      {!direccion.esPrincipal && (
                        <button
                          type="button"
                          onClick={() => setDireccionPrincipal(index)}
                          className="btn-secondary btn-xs"
                        >
                          Hacer Principal
                        </button>
                      )}
                      {formData.direcciones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDireccion(index)}
                          className="btn-danger btn-xs"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                        Calle *
                      </label>
                      <input
                        type="text"
                        value={direccion.calle}
                        onChange={(e) => handleDireccionChange(index, 'calle', e.target.value)}
                        className={`input-field ${errors[`direccion_${index}_calle`] ? 'input-error' : ''}`}
                        placeholder="Av. Providencia"
                      />
                      {errors[`direccion_${index}_calle`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`direccion_${index}_calle`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={direccion.numero}
                        onChange={(e) => handleDireccionChange(index, 'numero', e.target.value)}
                        className={`input-field ${errors[`direccion_${index}_numero`] ? 'input-error' : ''}`}
                        placeholder="1234"
                      />
                      {errors[`direccion_${index}_numero`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`direccion_${index}_numero`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                        Departamento
                      </label>
                      <input
                        type="text"
                        value={direccion.departamento}
                        onChange={(e) => handleDireccionChange(index, 'departamento', e.target.value)}
                        className="input-field"
                        placeholder="Depto 45"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                        Comuna *
                      </label>
                      <select
                        value={direccion.comuna}
                        onChange={(e) => handleDireccionChange(index, 'comuna', e.target.value)}
                        disabled={!direccion.region}
                      >
                        <option value="">Seleccione comuna</option>
                        {regionesYComunas.find(r => r.region === direccion.region)?.comunas.map(comuna => (
                          <option key={comuna} value={comuna}>{comuna}</option>
                        ))}
                      </select>
                      {errors[`direccion_${index}_comuna`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`direccion_${index}_comuna`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                        Región *
                      </label>
                      <select
                        value={direccion.region}
                        onChange={(e) => handleDireccionChange(index, 'region', e.target.value)}
                      >
                        <option value="">Seleccione región</option>
                        {regionesYComunas.map(r => (
                          <option key={r.region} value={r.region}>{r.region}</option>
                        ))}
                      </select>
                      {errors[`direccion_${index}_region`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`direccion_${index}_region`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ferremas-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={direccion.codigoPostal}
                        onChange={(e) => handleDireccionChange(index, 'codigoPostal', e.target.value)}
                        className="input-field"
                        placeholder="7500000"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-ferremas-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notificación */}
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default ClienteRegistro; 
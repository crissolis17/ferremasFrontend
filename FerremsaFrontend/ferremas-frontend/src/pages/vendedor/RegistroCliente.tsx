import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import type { ClienteCreateDTO } from '../../types/api';
import Notification from '../../components/ui/Notification';
import { regionesYComunas } from '../../utils/formatters';

const RegistroCliente: React.FC = () => {
  const navigate = useNavigate();
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
    errorList?: string[];
  }>({ isOpen: false, type: 'info', title: '' });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estados para regiones y comunas
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [regionSeleccionada, setRegionSeleccionada] = useState('');

  // Obtener regiones al cargar el componente
  useEffect(() => {
    fetch('http://localhost:5200/api/regiones')
      .then(res => res.json())
      .then(data => setRegiones(data));
  }, []);

  // Obtener comunas cuando cambia la región
  useEffect(() => {
    if (regionSeleccionada) {
      fetch(`http://localhost:5200/api/regiones/${regionSeleccionada}/comunas`)
        .then(res => res.json())
        .then(data => setComunas(data));
    } else {
      setComunas([]);
    }
  }, [regionSeleccionada]);

  const handleInputChange = (field: string, value: string) => {
    let newValue = value;
    if (field === 'rut') {
      newValue = value.replace(/\./g, '');
    }
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
    
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
        i === index ? { ...dir, [field]: value, ...(field === 'region' ? { comuna: '' } : {}) } : dir
      )
    }));
    if (field === 'region') setRegionSeleccionada(value);
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

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.rut.trim()) newErrors.rut = 'El RUT es obligatorio';
    if (!formData.correoElectronico.trim()) newErrors.correoElectronico = 'El email es obligatorio';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      newErrors.correoElectronico = 'Formato de email inválido';
    }

    const rutRegex = /^\d{7,8}-[\dkK]$/;
    if (formData.rut && !rutRegex.test(formData.rut)) {
      newErrors.rut = 'Formato de RUT inválido (ej: 12345678-9)';
    }

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
        
        // Redirigir al dashboard después de un delay
        setTimeout(() => {
          navigate('/vendedor');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error al registrar cliente:', error);
      
      let errorMessage = 'Error al registrar el cliente';
      let errorList = null;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (Array.isArray(error.response?.data?.errors)) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        errorList = Object.entries(error.response.data.errors).map(([campo, mensaje]) => `${campo}: ${mensaje}`);
        errorMessage = null;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors;
      } else if (typeof error.response?.data === 'string') {
        errorMessage = error.response.data;
      }
      
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error al registrar',
        message: errorMessage,
        errorList: errorList
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ferremas-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ferremas-primary">
                Registrar Nuevo Cliente
              </h1>
              <p className="text-ferremas-gray-600 mt-2">
                Complete la información del cliente para registrarlo en el sistema
              </p>
            </div>
            <button
              onClick={() => navigate('/vendedor')}
              className="btn-secondary"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información Personal */}
            <div>
              <h3 className="text-xl font-semibold text-ferremas-primary mb-6">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-ferremas-primary">
                  Direcciones de Envío
                </h3>
                <button
                  type="button"
                  onClick={addDireccion}
                  className="btn-secondary"
                >
                  + Agregar Dirección
                </button>
              </div>

              {formData.direcciones.map((direccion, index) => (
                <div key={index} className="border border-ferremas-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-ferremas-primary">
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
                        {comunas.map((c: any) => (
                          <option key={c.codigo} value={c.nombre}>{c.nombre}</option>
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
                        {regiones.map((r: any) => (
                          <option key={r.codigo} value={r.codigo}>{r.nombre}</option>
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
            <div className="flex justify-end space-x-4 pt-6 border-t border-ferremas-gray-200">
              <button
                type="button"
                onClick={() => navigate('/vendedor')}
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
        errorList={notification.errorList}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default RegistroCliente; 
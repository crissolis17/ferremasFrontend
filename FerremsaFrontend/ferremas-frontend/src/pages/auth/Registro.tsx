import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicApiClient } from '../../services/api';
import type { ClienteCreateDTO } from '../../types/api';
import Notification from '../../components/ui/Notification';
import { regionesYComunas } from '../../utils/formatters';

const Registro: React.FC = () => {
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
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido?.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.rut?.trim()) newErrors.rut = 'El RUT es obligatorio';
    if (!formData.correoElectronico?.trim()) newErrors.correoElectronico = 'El email es obligatorio';
    if (!formData.telefono?.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!password.trim()) newErrors.password = 'La contraseña es obligatoria';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Confirma tu contraseña';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      newErrors.correoElectronico = 'Formato de email inválido';
    }

    const rutRegex = /^\d{7,8}-[\dkK]$/;
    if (formData.rut && !rutRegex.test(formData.rut)) {
      newErrors.rut = 'Formato de RUT inválido (ej: 12345678-9)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    formData.direcciones.forEach((dir, index) => {
      if (!dir.calle.trim()) newErrors[`direccion_${index}_calle`] = 'La calle es obligatoria';
      if (!dir.numero.trim()) newErrors[`direccion_${index}_numero`] = 'El número es obligatorio';
      if (!dir.comuna.trim()) newErrors[`direccion_${index}_comuna`] = 'La comuna es obligatoria';
      if (!dir.region.trim()) newErrors[`direccion_${index}_region`] = 'La región es obligatoria';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error de validación',
        message: 'Por favor, corrige los errores en el formulario.'
      });
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error de validación',
        message: 'Por favor, completa la información de dirección.'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Crear el cliente
      const clienteResponse = await publicApiClient.post('/api/Clientes', formData);
      
      if (clienteResponse.data) {
        // Crear la cuenta de usuario
        const usuarioData = {
          nombre: formData.nombre,
          email: formData.correoElectronico,
          password: password,
          rol: 'cliente'
        };
        
        const usuarioResponse = await publicApiClient.post('/api/Auth/register', usuarioData);
        
        if (usuarioResponse.data?.exito) {
          setNotification({
            isOpen: true,
            type: 'success',
            title: '¡Registro exitoso!',
            message: `Bienvenido a Ferremas, ${formData.nombre}. Tu cuenta ha sido creada correctamente.`
          });
          
          // Redirigir al login después de un delay
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }
    } catch (error: any) {
      console.error('Error al registrar:', error);
      
      let errorMessage = 'Error al crear la cuenta';
      let errorList = null;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (Array.isArray(error.response?.data?.errors)) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        // Si es un objeto, mostrar cada campo y mensaje
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
        errorList: errorList // Nuevo campo para lista de errores
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 opacity-10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 opacity-5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center py-8 px-4">
        <div className="max-w-4xl w-full">
          {/* Header con banner animado */}
          <div className="mb-8 animate-fade-in">
            <Link to="/catalogo" className="inline-block mb-6">
              <div className="text-4xl font-bold text-blue-600 hover:text-orange-500 transition-all duration-300 transform hover:scale-105">
                Ferremas
              </div>
            </Link>
            
            {/* Banner animado simplificado */}
            <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-blue-600 to-orange-500">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-16 -translate-y-16 animate-float"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-12 translate-y-12 animate-float" style={{animationDelay: '2s'}}></div>
              </div>
              
              <div className="relative z-10 flex items-center space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-slide-in">
                    ¡Únete a la Familia Ferremas!
                  </h2>
                  <p className="text-lg text-white text-opacity-90 animate-slide-in" style={{animationDelay: '0.2s'}}>
                    Regístrate gratis y descubre un mundo de herramientas de calidad
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar mejorado */}
          <div className="mb-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= 1 ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-600'
              }`}>
                <span className="text-lg">1</span>
              </div>
              <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                step >= 2 ? 'bg-gradient-to-r from-blue-600 to-orange-500' : 'bg-gray-200'
              }`}></div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= 2 ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-600'
              }`}>
                <span className="text-lg">2</span>
              </div>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-600">
              <span className={`transition-colors duration-300 ${step >= 1 ? 'text-blue-600' : ''}`}>
                Información Personal
              </span>
              <span className={`transition-colors duration-300 ${step >= 2 ? 'text-blue-600' : ''}`}>
                Dirección de Envío
              </span>
            </div>
          </div>

          {/* Form con diseño mejorado */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                /* Paso 1: Información Personal */
                <div className="animate-slide-in">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">
                      Información Personal
                    </h3>
                    <p className="text-gray-600">
                      Cuéntanos sobre ti para crear tu cuenta
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.nombre ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Ingrese su nombre"
                      />
                      {errors.nombre && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.nombre}</p>
                      )}
                    </div>

                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.apellido ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Ingrese su apellido"
                      />
                      {errors.apellido && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.apellido}</p>
                      )}
                    </div>

                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RUT *
                      </label>
                      <input
                        type="text"
                        value={formData.rut}
                        onChange={(e) => handleInputChange('rut', e.target.value)}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.rut ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="12345678-9"
                      />
                      {errors.rut && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.rut}</p>
                      )}
                    </div>

                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.telefono ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="+56912345678"
                      />
                      {errors.telefono && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.telefono}</p>
                      )}
                    </div>

                    <div className="md:col-span-2 transform hover:scale-105 transition-transform duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.correoElectronico}
                        onChange={(e) => handleInputChange('correoElectronico', e.target.value)}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.correoElectronico ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="su-email@ejemplo.com"
                      />
                      {errors.correoElectronico && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.correoElectronico}</p>
                      )}
                    </div>

                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Mínimo 6 caracteres"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.password}</p>
                      )}
                    </div>

                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Contraseña *
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="Repita su contraseña"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                    >
                      <span>Siguiente: Dirección de Envío</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* Paso 2: Dirección de Envío */
                <div className="animate-slide-in">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">
                      Dirección de Envío
                    </h3>
                    <p className="text-gray-600">
                      ¿Dónde quieres recibir tus pedidos?
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600 font-medium">
                      Direcciones de envío
                    </p>
                    <button
                      type="button"
                      onClick={addDireccion}
                      className="bg-gray-100 hover:bg-gray-200 text-blue-600 border-2 border-blue-600 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Agregar Dirección
                    </button>
                  </div>

                  {formData.direcciones.map((direccion, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-xl p-6 mb-6 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-blue-600 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          Dirección {index + 1}
                          {direccion.esPrincipal && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2 animate-pulse">Principal</span>
                          )}
                        </h4>
                        <div className="flex space-x-2">
                          {!direccion.esPrincipal && (
                            <button
                              type="button"
                              onClick={() => setDireccionPrincipal(index)}
                              className="bg-gray-100 hover:bg-gray-200 text-blue-600 border border-blue-600 font-semibold py-1 px-3 rounded text-sm transition-all duration-200 transform hover:scale-105"
                            >
                              Hacer Principal
                            </button>
                          )}
                          {formData.direcciones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDireccion(index)}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm transition-all duration-200 transform hover:scale-105"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="transform hover:scale-105 transition-transform duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Calle *
                          </label>
                          <input
                            type="text"
                            value={direccion.calle}
                            onChange={(e) => handleDireccionChange(index, 'calle', e.target.value)}
                            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors[`direccion_${index}_calle`] ? 'border-red-500 bg-red-50' : ''}`}
                            placeholder="Av. Providencia"
                          />
                          {errors[`direccion_${index}_calle`] && (
                            <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors[`direccion_${index}_calle`]}</p>
                          )}
                        </div>

                        <div className="transform hover:scale-105 transition-transform duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número *
                          </label>
                          <input
                            type="text"
                            value={direccion.numero}
                            onChange={(e) => handleDireccionChange(index, 'numero', e.target.value)}
                            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors[`direccion_${index}_numero`] ? 'border-red-500 bg-red-50' : ''}`}
                            placeholder="1234"
                          />
                          {errors[`direccion_${index}_numero`] && (
                            <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors[`direccion_${index}_numero`]}</p>
                          )}
                        </div>

                        <div className="transform hover:scale-105 transition-transform duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Departamento
                          </label>
                          <input
                            type="text"
                            value={direccion.departamento}
                            onChange={(e) => handleDireccionChange(index, 'departamento', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Depto 45"
                          />
                        </div>

                        <div className="transform hover:scale-105 transition-transform duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors[`direccion_${index}_comuna`]}</p>
                          )}
                        </div>

                        <div className="transform hover:scale-105 transition-transform duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors[`direccion_${index}_region`]}</p>
                          )}
                        </div>

                        <div className="transform hover:scale-105 transition-transform duration-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Código Postal
                          </label>
                          <input
                            type="text"
                            value={direccion.codigoPostal}
                            onChange={(e) => handleDireccionChange(index, 'codigoPostal', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="7500000"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-gray-100 hover:bg-gray-200 text-blue-600 border-2 border-blue-600 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creando cuenta...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Crear Cuenta</span>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Enlaces adicionales con mejor diseño */}
          <div className="text-center mt-8 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-gray-600 mb-4">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-blue-600 hover:text-orange-500 font-bold transition-colors duration-200">
                  Inicia sesión aquí
                </Link>
              </p>
              <div className="border-t border-gray-200 pt-4">
                <Link to="/catalogo" className="text-blue-600 hover:text-orange-500 font-medium transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver al catálogo
                </Link>
              </div>
            </div>
          </div>
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

export default Registro; 
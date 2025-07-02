import React, { useState } from 'react';
import { publicApiClient } from '../../services/api';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../constants/api';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Iniciando pruebas de conexión...');
      addResult(`📍 URL del backend: ${API_BASE_URL}`);
      
      // Test 1: Conexión básica
      addResult('📡 Probando conexión básica...');
      const response = await publicApiClient.get('/api/Productos');
      addResult(`✅ Conexión exitosa - Status: ${response.status}`);
      addResult(`📦 Productos encontrados: ${response.data?.productos?.length || 0}`);
      
      // Test 2: Endpoint de autenticación
      addResult('🔐 Probando endpoint de autenticación...');
      try {
        const authResponse = await publicApiClient.post(AUTH_ENDPOINTS.LOGIN, {
          email: 'test@test.com',
          password: 'test123'
        });
        addResult(`✅ Endpoint de auth responde - Status: ${authResponse.status}`);
      } catch (error: any) {
        addResult(`⚠️ Endpoint de auth responde con error: ${error.response?.status || 'Sin respuesta'}`);
        addResult(`📝 Mensaje: ${error.response?.data?.message || error.message}`);
      }
      
      // Test 3: Verificar estructura de respuesta
      addResult('🔍 Verificando estructura de respuesta de productos...');
      if (response.data) {
        const keys = Object.keys(response.data);
        addResult(`📋 Claves en respuesta: ${keys.join(', ')}`);
        
        if (response.data.productos) {
          addResult(`📦 Tipo de productos: ${Array.isArray(response.data.productos) ? 'Array' : typeof response.data.productos}`);
          if (Array.isArray(response.data.productos) && response.data.productos.length > 0) {
            const firstProduct = response.data.productos[0];
            addResult(`🔍 Primer producto - ID: ${firstProduct.id}, Nombre: ${firstProduct.nombre}`);
          }
        }
      }
      
    } catch (error: any) {
      addResult(`❌ Error de conexión: ${error.message}`);
      if (error.response) {
        addResult(`📊 Status: ${error.response.status}`);
        addResult(`📝 Data: ${JSON.stringify(error.response.data)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-ferremas-primary">Pruebas de API</h2>
      
      <button
        onClick={testBackendConnection}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Probando...' : 'Ejecutar Pruebas'}
      </button>
      
      <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Resultados:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500">Haz clic en "Ejecutar Pruebas" para comenzar</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Información de Configuración:</h3>
        <div className="text-sm space-y-1">
          <p><strong>URL del Backend:</strong> {API_BASE_URL}</p>
          <p><strong>Endpoint de Login:</strong> {AUTH_ENDPOINTS.LOGIN}</p>
          <p><strong>Endpoint de Productos:</strong> /api/Productos</p>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 
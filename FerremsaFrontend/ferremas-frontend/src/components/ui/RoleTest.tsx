import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRedirectPathByRole, getRoleDisplayName, isWorkerRole, isClientRole } from '../../utils/roleRedirect';

const RoleTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [testRole, setTestRole] = useState('');
  const [testResult, setTestResult] = useState('');

  const roles = [
    'cliente',
    'vendedor', 
    'bodeguero',
    'administrador',
    'contador',
    'repartidor'
  ];

  const testRoleRedirect = (role: string) => {
    const redirectPath = getRedirectPathByRole(role);
    const displayName = getRoleDisplayName(role);
    const isWorker = isWorkerRole(role);
    const isClient = isClientRole(role);
    
    setTestResult(`
      Rol: ${role}
      Nombre: ${displayName}
      Redirección: ${redirectPath}
      Es Trabajador: ${isWorker ? 'Sí' : 'No'}
      Es Cliente: ${isClient ? 'Sí' : 'No'}
    `);
  };

  const simulateLogin = (role: string) => {
    const redirectPath = getRedirectPathByRole(role);
    console.log(`🔐 Simulando login con rol: ${role}`);
    console.log(`📍 Redirigiendo a: ${redirectPath}`);
    navigate(redirectPath);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-ferremas-primary mb-6">
          Prueba de Sistema de Roles
        </h1>

        {/* Estado actual */}
        <div className="mb-8 p-4 bg-ferremas-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-ferremas-primary mb-4">Estado Actual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Autenticado:</strong> {isAuthenticated ? 'Sí' : 'No'}</p>
              {user && (
                <>
                  <p><strong>Usuario:</strong> {user.nombre}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Rol:</strong> {user.rol}</p>
                  <p><strong>Nombre del Rol:</strong> {getRoleDisplayName(user.rol)}</p>
                  <p><strong>Es Trabajador:</strong> {isWorkerRole(user.rol) ? 'Sí' : 'No'}</p>
                  <p><strong>Es Cliente:</strong> {isClientRole(user.rol) ? 'Sí' : 'No'}</p>
                </>
              )}
            </div>
            <div>
              <p><strong>Ruta Actual:</strong> {window.location.pathname}</p>
              <p><strong>Redirección Esperada:</strong> {user ? getRedirectPathByRole(user.rol) : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Prueba de roles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ferremas-primary mb-4">Probar Redirecciones por Rol</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => testRoleRedirect(role)}
                className="p-3 bg-ferremas-primary text-white rounded-lg hover:bg-ferremas-primary-dark transition-colors"
              >
                {getRoleDisplayName(role)}
              </button>
            ))}
          </div>
        </div>

        {/* Resultado de la prueba */}
        {testResult && (
          <div className="mb-8 p-4 bg-ferremas-accent bg-opacity-10 rounded-lg">
            <h3 className="text-lg font-semibold text-ferremas-primary mb-2">Resultado de la Prueba</h3>
            <pre className="text-sm text-ferremas-gray-700 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        {/* Simulación de login */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ferremas-primary mb-4">Simular Login con Rol</h2>
          <div className="flex flex-wrap gap-4">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => simulateLogin(role)}
                className="px-4 py-2 bg-ferremas-success text-white rounded-lg hover:bg-ferremas-success-dark transition-colors"
              >
                Login como {getRoleDisplayName(role)}
              </button>
            ))}
          </div>
        </div>

        {/* Información del sistema */}
        <div className="bg-ferremas-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-ferremas-primary mb-2">Información del Sistema</h2>
          <div className="text-sm text-ferremas-gray-600 space-y-1">
            <p><strong>Roles de Trabajador:</strong> Administrador, Vendedor, Bodeguero, Contador, Repartidor</p>
            <p><strong>Roles de Cliente:</strong> Cliente</p>
            <p><strong>Redirecciones:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Cliente → /mi-cuenta</li>
              <li>• Vendedor → /vendedor</li>
              <li>• Bodeguero → /bodeguero/dashboard</li>
              <li>• Administrador → /admin/dashboard</li>
              <li>• Contador → /contador/dashboard</li>
              <li>• Repartidor → /repartidor/dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleTest; 
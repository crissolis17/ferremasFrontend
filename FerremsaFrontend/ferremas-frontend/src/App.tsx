// src/App.tsx
import React, { useState, useEffect, useCallback, memo } from 'react'
import { authService } from './services/auth'
import { RolUsuario } from './types/api'
import type { LoginDTO, UsuarioResponseDTO } from './types/api'
import VendedorView from './views/VendedorView'
import BodegueroView from './views/BodegueroView'
import AdminView from './views/AdminView'
import ClienteView from './views/ClienteView'
import './App.css'

// Componente LoginForm separado y memo-izado
const LoginForm = memo(({ onSubmit, onCancel, isLoading }: {
  onSubmit: (email: string, password: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="login-container bg-gradient-pattern from-ferremas-orange-50 via-white to-ferremas-green-50">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ferremas-orange-400 to-ferremas-green-400 rounded-t-lg"></div>
        
        <div className="mb-8 text-center">
          <div className="inline-block p-4 rounded-full bg-ferremas-orange-100 mb-4">
            <span className="text-4xl">🔧</span>
          </div>
          <h2 className="text-2xl font-bold text-ferremas-primary mb-2">Bienvenido a Ferremas</h2>
          <p className="text-ferremas-gray-600">Accede a tu cuenta para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="text-sm font-medium text-ferremas-gray-700">
              Correo electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ferremas-gray-400">
                📧
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="input-field pl-10"
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="text-sm font-medium text-ferremas-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ferremas-gray-400">
                🔒
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Tu contraseña"
                className="input-field pl-10"
                autoComplete="current-password"
              />
            </div>
          </div>
          
          <div className="form-actions mt-8">
            <button 
              type="button" 
              onClick={onCancel}
              className="btn-secondary hover:bg-ferremas-gray-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="btn-primary bg-gradient-to-r from-ferremas-orange-500 to-ferremas-orange-600 hover:from-ferremas-orange-600 hover:to-ferremas-orange-700 shadow-glow"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

LoginForm.displayName = 'LoginForm'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<UsuarioResponseDTO | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false)

  useEffect(() => {
    checkAuthenticationStatus()
  }, [])

  const checkAuthenticationStatus = () => {
    console.log('🔍 Verificando estado de autenticación...')
    
    const isAuth = authService.isAuthenticated()
    const user = authService.getCurrentUser()
    
    setIsAuthenticated(isAuth)
    setCurrentUser(user)
    setIsLoading(false)

    console.log('Estado de autenticación:', isAuth ? '✅ Autenticado' : '❌ No autenticado')
  }

  const handleLoginSubmit = useCallback(async (email: string, password: string) => {
    setIsLoading(true)

    try {
      console.log('🔐 Intentando iniciar sesión...')
      
      const response = await authService.login({ email, password })
      
      if (response.success) {
        setIsAuthenticated(true)
        setCurrentUser(authService.getCurrentUser())
        setShowLoginForm(false)
        console.log('✅ Login exitoso')
      } else {
        console.error('❌ Login fallido:', response.message)
        alert(response.message || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      alert('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogout = useCallback(() => {
    console.log('👋 Cerrando sesión...')
    authService.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
  }, [])

  // Renderizar vista según el rol del usuario
  const renderUserView = () => {
    if (!currentUser) return null

    switch (currentUser.rol) {
      case RolUsuario.VENDEDOR:
        return <VendedorView />
      case RolUsuario.BODEGUERO:
        return <BodegueroView />
      case RolUsuario.ADMIN:
        return <AdminView />
      case 'cliente':
      case RolUsuario.CLIENTE:
        return <ClienteView />
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-ferremas-primary">
              Acceso No Autorizado
            </h2>
            <p className="text-ferremas-gray-600 mt-2">
              No tienes permisos para acceder al sistema.
            </p>
          </div>
        )
    }
  }

  if (isLoading && !showLoginForm) {
    return (
      <div className="min-h-screen bg-ferremas-background flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-elevated">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <h2 className="text-2xl font-semibold text-ferremas-primary mb-2">
            Cargando Ferremas...
          </h2>
          <p className="text-ferremas-gray-500">
            Verificando tu sesión
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-pattern from-ferremas-background via-white to-ferremas-background">
      {showLoginForm && (
        <LoginForm 
          onSubmit={handleLoginSubmit}
          onCancel={() => setShowLoginForm(false)}
          isLoading={isLoading}
        />
      )}

      <header className="bg-ferremas-surface shadow-sm border-b border-ferremas-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-ferremas-orange-100 to-ferremas-orange-200 rounded-lg">
                <span className="text-2xl">🔧</span>
              </div>
              <h1 className="text-2xl font-bold text-ferremas-primary">Ferremas</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated && currentUser ? (
                <>
                  <span className="text-ferremas-gray-600 bg-ferremas-gray-50 py-2 px-4 rounded-lg border border-ferremas-gray-100">
                    👋 Hola, {currentUser.nombre}
                  </span>
                  <span className="badge-info">
                    {currentUser.rol}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn-secondary text-sm hover:bg-ferremas-gray-200"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setShowLoginForm(true)}
                  className="btn-primary bg-gradient-to-r from-ferremas-orange-500 to-ferremas-orange-600 hover:from-ferremas-orange-600 hover:to-ferremas-orange-700"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto">
        {isAuthenticated ? (
          renderUserView()
        ) : (
          <div className="p-6 space-y-8">
            <section className="hero bg-gradient-to-br from-ferremas-orange-50 via-white to-ferremas-green-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ferremas-orange-400 to-ferremas-green-400"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-ferremas-primary mb-4">
                  Sistema de Gestión Ferremas
                </h2>
                <p className="text-ferremas-gray-600 text-xl mb-8 max-w-2xl mx-auto">
                  Plataforma profesional para la gestión integral de ferretería
                </p>
                <button 
                  onClick={() => setShowLoginForm(true)}
                  className="btn-primary text-lg px-8 py-3 bg-gradient-to-r from-ferremas-orange-500 to-ferremas-orange-600 hover:from-ferremas-orange-600 hover:to-ferremas-orange-700 shadow-glow"
                >
                  Acceder al Sistema
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="feature-card group hover:shadow-glow hover:border-ferremas-orange-200">
                <div className="p-3 bg-gradient-to-br from-ferremas-orange-100 to-ferremas-orange-50 rounded-lg inline-block mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-ferremas-primary mb-3 group-hover:text-ferremas-orange-600">
                  Control de Inventario
                </h3>
                <p className="text-ferremas-gray-600">
                  Gestión eficiente de productos y stock
                </p>
              </div>

              <div className="feature-card group hover:shadow-glow hover:border-ferremas-green-200">
                <div className="p-3 bg-gradient-to-br from-ferremas-green-100 to-ferremas-green-50 rounded-lg inline-block mb-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-semibold text-ferremas-primary mb-3 group-hover:text-ferremas-green-600">
                  Gestión de Pedidos
                </h3>
                <p className="text-ferremas-gray-600">
                  Seguimiento completo de pedidos
                </p>
              </div>

              <div className="feature-card group hover:shadow-glow hover:border-ferremas-orange-200">
                <div className="p-3 bg-gradient-to-br from-ferremas-orange-100 to-ferremas-green-100 rounded-lg inline-block mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-ferremas-primary mb-3 group-hover:text-ferremas-orange-600">
                  Análisis Avanzado
                </h3>
                <p className="text-ferremas-gray-600">
                  Reportes y estadísticas detalladas
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-ferremas-surface mt-auto py-6 border-t border-ferremas-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-ferremas-gray-600">&copy; 2025 Ferremas - Sistema de Gestión Integrada</p>
          <p className="text-sm mt-1 text-ferremas-gray-500">
            {isAuthenticated && currentUser
              ? `Sesión activa - ${currentUser.nombre}` 
              : 'Desarrollado para DuocUC - Integración de Plataformas'
            }
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
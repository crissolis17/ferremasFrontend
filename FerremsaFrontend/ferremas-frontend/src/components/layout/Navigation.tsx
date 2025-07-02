import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleDisplayName, isWorkerRole } from '../../utils/roleRedirect';
import { api } from '../../services/api';

interface NavigationProps {
  onOpenCart?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onOpenCart }) => {
  const { isAuthenticated, user, logout, token } = useAuth();
  const location = useLocation();
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const isCliente = user && user.rol && user.rol.toLowerCase().includes('cliente');
    if (!isAuthenticated || !token || !isCliente) {
      setCartCount(0);
      return;
    }
    const fetchCartCount = async () => {
      try {
        const resumen = await api.getCarritoResumen();
        setCartCount(resumen.totalItems || 0);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          logout();
        }
        setCartCount(0);
      }
    };
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, token, user]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const role = user.rol.toLowerCase();
    if (role.includes('admin') || role.includes('administrador')) {
      return '/admin';
    } else if (role.includes('vendedor') || role.includes('seller')) {
      return '/vendedor';
    } else if (role.includes('bodeguero') || role.includes('warehouse')) {
      return '/bodeguero';
    } else if (role.includes('contador') || role.includes('accountant')) {
      return '/contador/dashboard';
    } else if (role.includes('repartidor') || role.includes('delivery')) {
      return '/repartidor/dashboard';
    } else {
      return '/mi-cuenta'; // Cliente por defecto
    }
  };

  return (
    <header className="bg-primary shadow-vibrant rounded-b-2xl relative z-50">
      {/* Detalle decorativo: círculo animado */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent opacity-20 rounded-full blur-2xl animate-float pointer-events-none"></div>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/catalogo" className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide hover:scale-105 transition-transform duration-200">
          Ferremas
        </Link>

        {/* Navegación principal */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/catalogo" 
            className={`text-base font-semibold transition-colors px-2 py-1 rounded-lg ${
              isActive('/catalogo') 
                ? 'text-accent bg-surface bg-opacity-10' 
                : 'text-white hover:text-accent hover:bg-surface hover:bg-opacity-10'
            }`}
          >
            Catálogo
          </Link>
          {isAuthenticated && (
            <Link 
              to={getDashboardLink()} 
              className={`text-base font-semibold transition-colors px-2 py-1 rounded-lg ${
                isActive(getDashboardLink()) 
                  ? 'text-accent bg-surface bg-opacity-10' 
                  : 'text-white hover:text-accent hover:bg-surface hover:bg-opacity-10'
              }`}
            >
              Mi Panel
            </Link>
          )}
          {/* Enlace de registro de clientes para vendedores */}
          {isAuthenticated && user && (user.rol.toLowerCase().includes('vendedor') || user.rol.includes('seller')) && (
            <Link 
              to="/vendedor/registro-cliente" 
              className={`text-base font-semibold transition-colors px-2 py-1 rounded-lg ${
                isActive('/vendedor/registro-cliente') 
                  ? 'text-accent bg-surface bg-opacity-10' 
                  : 'text-white hover:text-accent hover:bg-surface hover:bg-opacity-10'
              }`}
            >
              Registrar Cliente
            </Link>
          )}
        </div>

        {/* Menú de usuario y botón carrito */}
        <div className="flex items-center space-x-4">
          {/* Botón Carrito */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2 rounded-full transition-all duration-200 focus:outline-none hover:bg-white hover:bg-opacity-20"
            aria-label="Ver carrito"
            style={{ background: 'none', boxShadow: 'none' }}
          >
            {/* Icono Heroicons outline: Shopping Cart */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.5l.401 2.007A2.25 2.25 0 006.57 7.5h10.86a2.25 2.25 0 002.219-2.493l-.401-2.007h1.5M6.75 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM6.75 18h10.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 7.5v8.25A2.25 2.25 0 006.75 18z" />
            </svg>
            {isAuthenticated && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-primary">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Enlaces de desarrollo */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link to="/test-colors" className="text-xs text-white hover:text-accent transition-colors">Test Colores</Link>
            <Link to="/test-api" className="text-xs text-white hover:text-accent transition-colors">Test API</Link>
            <Link to="/debug-auth" className="text-xs text-white hover:text-accent transition-colors">Debug Auth</Link>
            <Link to="/test-roles" className="text-xs text-white hover:text-accent transition-colors">Test Roles</Link>
          </div>

          {/* Información del usuario */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-base font-bold text-accent drop-shadow-sm">{user.nombre}</p>
                <p className="text-xs text-white text-opacity-80">{getRoleDisplayName(user.rol)}</p>
              </div>
              {/* Botón de logout */}
              <button
                onClick={logout}
                className="text-sm text-white hover:text-accent transition-colors px-2 py-1 rounded-lg"
              >
                Cerrar Sesión
              </button>
            </div>
          )}

          {/* Botón de login */}
          {!isAuthenticated && (
            <Link 
              to="/login" 
              className="bg-accent text-white font-bold px-5 py-2 rounded-xl shadow-vibrant hover:bg-secondary hover:scale-105 hover:shadow-vibrant-hover transition-all duration-200 text-base"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>
      {/* Línea decorativa inferior */}
      <div className="h-1 bg-warning opacity-80 rounded-b-xl"></div>
    </header>
  );
};

export default Navigation; 
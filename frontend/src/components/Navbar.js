import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout, canManageStudents, isStudent } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => {
    const baseClass = "text-gray-700 hover:text-black/70 transition-colors font-medium";
    const activeWrapper = "text-black/70 border border-black/70 rounded-md px-3 py-1 shadow-sm bg-white";
    return isActive(path)
      ? `${baseClass} ${activeWrapper}`
      : baseClass;
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MENTOR': return 'Mentor';
      case 'USER': return 'Estudiante';
      default: return role;
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-28">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/images/LogoLearn.jpg" alt="Logo Mentoria Learn" className="h-28 w-28 rounded flex-shrink-0" />
            <span className="text-2xl font-bold text-yellow-500 whitespace-nowrap">Mentoria Learn</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <Link to="/" className={navLinkClass('/')}>
              Inicio
            </Link>
            <Link to="/mentores" className={navLinkClass('/mentores')}>
              Mentores
            </Link>
            <Link to="/programas" className={navLinkClass('/programas')}>
              Programas
            </Link>
            <Link to="/cursos" className={navLinkClass('/cursos')}>
              Cursos
            </Link>
            <Link to="/contacto" className={navLinkClass('/contacto')}>
              Contacto
            </Link>
            <Link to="/comunidad" className={navLinkClass('/comunidad')}>
              Comunidad
            </Link>
            {canManageStudents() && (
              <Link to="/estudiantes" className={navLinkClass('/estudiantes')}>
                Estudiantes
              </Link>
            )}
            {isAuthenticated() && isStudent() && (
              <Link to="/perfil" className={navLinkClass('/perfil')}>
                Mi Perfil
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 font-medium transition-colors ${location.pathname === '/perfil'
                    ? 'text-black/70 border border-black/70 rounded-md px-3 py-1 shadow-sm bg-white'
                    : 'text-gray-700 hover:text-black/70'
                    }`}
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[140px] truncate">{user?.username}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.username}</div>
                      <div className="text-gray-500">{getRoleDisplayName(user?.role)}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/register"
                  className={navLinkClass('/register')}
                >
                  Registrarse
                </Link>
                <Link
                  to="/login"
                  className="bg-black/70 text-white px-4 py-2 rounded-full hover:bg-black transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700 hover:text-black/70">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Mentores from './pages/Mentores';
import PerfilMentor from './pages/PerfilMentor';
import Programas from './pages/Programas';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import Estudiantes from './pages/Estudiantes';
import Comunidad from './pages/Comunidad';
import Cursos from './pages/Cursos';
import Perfil from './pages/Perfil';

function App() {
  const backgroundStyle = {
    background: `
      linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)),
      url('/images/background.jpg') no-repeat center center fixed
    `,
    backgroundSize: 'cover',
    minHeight: '100vh'
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" style={backgroundStyle}>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mentores" element={<Mentores />} />
              <Route path="/mentores/:id" element={<PerfilMentor />} />
              <Route path="/programas" element={<Programas />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/comunidad" element={<Comunidad />} />
              <Route 
                path="/estudiantes" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MENTOR']}>
                    <Estudiantes />
                  </ProtectedRoute>
                } 
              />
              <Route path="/perfil" element={<Perfil />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 
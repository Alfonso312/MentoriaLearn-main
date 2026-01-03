import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { estudianteService, authService, inscripcionService, contactoService, cursoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';

function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [usuariosEstudiantes, setUsuariosEstudiantes] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    grado: '',
    escuela: '',
    telefono: '',
    direccion: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated, canManageStudents, user, isAdmin } = useAuth();
  const [mentores, setMentores] = useState([]);
  const [editInscripcionModalOpen, setEditInscripcionModalOpen] = useState(false);
  const [inscripcionEditando, setInscripcionEditando] = useState(null);
  const [editInscripcionForm, setEditInscripcionForm] = useState({ estudianteId: '', cursoId: '' });
  const [cursos, setCursos] = useState([]);

  // Lista real de mentores y cursos que dictan
  const mentoresEmpresa = [
    {
      nombre: 'Ing. Ana Pérez',
      especialidad: 'Spring Boot, Python',
      cursos: ['Spring Boot desde Cero', 'Programación en Python desde Cero'],
      email: 'ana.perez@certus.edu.pe',
    },
    {
      nombre: 'Ing. Luis Torres',
      especialidad: 'Java',
      cursos: ['Java para Principiantes'],
      email: 'luis.torres@certus.edu.pe',
    },
    {
      nombre: 'Lic. Carla Mendoza',
      especialidad: 'React',
      cursos: ['Desarrollo Web con React'],
      email: 'carla.mendoza@certus.edu.pe',
    },
    {
      nombre: 'Ing. Pablo Ruiz',
      especialidad: 'Flutter',
      cursos: ['Aplicaciones Móviles con Flutter'],
      email: 'pablo.ruiz@certus.edu.pe',
    },
    {
      nombre: 'Dra. Sofía Ramírez',
      especialidad: 'Machine Learning',
      cursos: ['Machine Learning Aplicado'],
      email: 'sofia.ramirez@certus.edu.pe',
    },
  ];

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    if (isAuthenticated() && canManageStudents()) {
      loadEstudiantes();
      loadUsuariosEstudiantes();
      loadInscripciones();
      // Cargar formularios de contacto si es admin
      if (canManageStudents()) {
        contactoService.getAll().then(res => setFormularios(res.data)).catch(() => setFormularios([]));
      }
      // Cargar mentores si es admin
      if (isAdmin && isAdmin()) {
        authService.getUsersByRole('MENTOR').then(res => setMentores(res.data)).catch(() => setMentores([]));
      }
      cursoService.getAll().then(res => setCursos(res.data)).catch(() => setCursos([]));
    }
  }, [isAuthenticated, canManageStudents]);

  // Si no está autenticado o no puede gestionar estudiantes, redirigir
  if (!isAuthenticated() || !canManageStudents()) {
    return <Navigate to="/login" replace />;
  }

  const loadEstudiantes = async () => {
    try {
      const response = await estudianteService.getAll();
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  };

  const loadUsuariosEstudiantes = async () => {
    try {
      const response = await authService.getUsersByRole('USER');
      setUsuariosEstudiantes(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios estudiantes:', error);
    }
  };

  const loadInscripciones = async () => {
    try {
      const response = await inscripcionService.getAll();
      setInscripciones(response.data);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await estudianteService.create(formData);

      if (response.data) {
        setMessage({ type: 'success', text: '¡Estudiante registrado exitosamente!' });
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          grado: '',
          escuela: '',
          telefono: '',
          direccion: ''
        });
        setShowForm(false);
        loadEstudiantes(); // Recargar la lista
        loadUsuariosEstudiantes(); // Recargar también usuarios estudiantes
      }
    } catch (error) {
      console.error('Error al registrar estudiante:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al registrar estudiante'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      try {
        await estudianteService.delete(id);
        setMessage({ type: 'success', text: 'Estudiante eliminado exitosamente' });
        loadEstudiantes();
        loadUsuariosEstudiantes(); // Recargar también usuarios estudiantes
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al eliminar estudiante' });
      }
    }
  };

  const handleDescargarPDF = (insc) => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString();
    doc.setFontSize(16);
    doc.text('Comprobante de Inscripción', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de descarga: ${fecha}`, 20, 30);
    doc.text(`Estudiante: ${insc.estudiante?.nombre} ${insc.estudiante?.apellido}`, 20, 45);
    doc.text(`Email: ${insc.estudiante?.email}`, 20, 55);
    doc.text(`Curso: ${insc.curso?.titulo}`, 20, 65);
    doc.text(`Mentor: ${insc.curso?.mentor}`, 20, 75);
    doc.text(`Nivel: ${insc.curso?.nivel}`, 20, 85);
    if (insc.curso?.horarios) {
      doc.text('Horarios:', 20, 95);
      insc.curso.horarios.forEach((h, i) => {
        doc.text(`- ${h}`, 30, 105 + i * 10);
      });
    }
    doc.save('comprobante_inscripcion.pdf');
  };

  const handleDeleteInscripcion = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) {
      try {
        await inscripcionService.delete(id);
        setMessage({ type: 'success', text: 'Inscripción eliminada exitosamente' });
        loadInscripciones();
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al eliminar inscripción' });
      }
    }
  };

  const handleAbrirEditarInscripcion = (insc) => {
    setInscripcionEditando(insc);
    setEditInscripcionForm({
      estudianteId: insc.estudiante?.id || '',
      cursoId: insc.curso?.id || ''
    });
    setEditInscripcionModalOpen(true);
  };

  const handleEditInscripcionFormChange = (e) => {
    setEditInscripcionForm({ ...editInscripcionForm, [e.target.name]: e.target.value });
  };

  const handleGuardarEdicionInscripcion = async () => {
    try {
      await inscripcionService.update(inscripcionEditando.id, {
        estudiante: { id: editInscripcionForm.estudianteId },
        curso: { id: editInscripcionForm.cursoId }
      });
      setEditInscripcionModalOpen(false);
      setInscripcionEditando(null);
      setEditInscripcionForm({ estudianteId: '', cursoId: '' });
      setMessage({ type: 'success', text: 'Inscripción actualizada correctamente' });
      loadInscripciones();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar inscripción' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Gestión de Estudiantes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Administra los estudiantes registrados en el programa de mentoría
        </p>
      </div>

      {/* Mensaje de estado */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
          {message.text}
        </div>
      )}

      {/* Botones de acción */}
      <div className="mb-8 text-center space-x-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Ocultar Formulario' : 'Agregar Nuevo Estudiante'}
        </button>

        <Link
          to="/register"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
        >
          Registrar Nuevo Usuario
        </Link>
      </div>

      {/* Formulario de registro */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Registrar Nuevo Estudiante
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grado
              </label>
              <select
                name="grado"
                value={formData.grado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              >
                <option value="">Selecciona un grado</option>
                <option value="1° Primaria">1° Primaria</option>
                <option value="2° Primaria">2° Primaria</option>
                <option value="3° Primaria">3° Primaria</option>
                <option value="4° Primaria">4° Primaria</option>
                <option value="5° Primaria">5° Primaria</option>
                <option value="6° Primaria">6° Primaria</option>
                <option value="1° Secundaria">1° Secundaria</option>
                <option value="2° Secundaria">2° Secundaria</option>
                <option value="3° Secundaria">3° Secundaria</option>
                <option value="4° Secundaria">4° Secundaria</option>
                <option value="5° Secundaria">5° Secundaria</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escuela
              </label>
              <input
                type="text"
                name="escuela"
                value={formData.escuela}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white`}
              >
                {loading ? 'Registrando...' : 'Registrar Estudiante'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de estudiantes */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Estudiantes Registrados ({estudiantes.length + usuariosEstudiantes.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Incluye estudiantes registrados por mentores y usuarios que se registraron directamente
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grado/Escuela
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Estudiantes registrados por mentores */}
              {estudiantes.map((estudiante) => (
                <tr key={`estudiante-${estudiante.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Registrado por Mentor
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {estudiante.nombre} {estudiante.apellido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{estudiante.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{estudiante.grado}</div>
                      <div className="text-gray-500">{estudiante.escuela}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{estudiante.telefono}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(estudiante.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {/* Usuarios que se registraron como estudiantes */}
              {usuariosEstudiantes.map((usuario) => (
                <tr key={`usuario-${usuario.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Auto-registrado
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {usuario.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{usuario.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      Información no disponible
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      No disponible
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className="text-gray-400">No editable</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {estudiantes.length === 0 && usuariosEstudiantes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay estudiantes registrados aún.
            </div>
          )}
        </div>
      </div>

      {/* Tabla de inscripciones */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Inscripciones de Estudiantes en Cursos
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inscripciones.map((insc) => (
                <tr key={insc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {insc.estudiante?.nombre} {insc.estudiante?.apellido} <br />
                    <span className="text-xs text-gray-500">{insc.estudiante?.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {insc.curso?.titulo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="bg-black/70 text-white px-4 py-2 rounded-lg font-semibold hover:bg-black transition-colors"
                      onClick={() => handleDescargarPDF(insc)}
                    >
                      Descargar PDF
                    </button>
                    {isAdmin && isAdmin() && (
                      <>
                        <button
                          className="ml-2 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                          onClick={() => handleAbrirEditarInscripcion(insc)}
                        >
                          Editar
                        </button>
                        <button
                          className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                          onClick={() => handleDeleteInscripcion(insc.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apartado de formularios recibidos (solo admin/mentor) */}
      {canManageStudents() && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Formularios de Contacto Recibidos</h2>
          </div>
          <div className="overflow-x-auto">
            {formularios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No hay formularios recibidos aún.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formularios.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{f.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{f.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{f.telefono}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{f.mensaje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Apartado de Mentores y Estudiantes (solo admin) */}
      {isAdmin && isAdmin() && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Mentores y Estudiantes</h2>
          </div>
          <div className="overflow-x-auto px-8">
            <h3 className="text-lg font-bold text-indigo-700 mt-4 mb-2">Mentores Registrados</h3>
            {mentoresEmpresa.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No hay mentores registrados.</div>
            ) : (
              <div className="w-full max-w-3xl">
                <table className="min-w-full divide-y divide-gray-200 mb-8">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cursos que dicta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mentoresEmpresa.map((m, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{m.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{m.especialidad}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{m.cursos.join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{m.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <h3 className="text-lg font-bold text-indigo-700 mt-4 mb-2">Estudiantes Registrados</h3>
            {estudiantes.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No hay estudiantes registrados.</div>
            ) : (
              <div className="w-full max-w-3xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {estudiantes.map(e => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{e.nombre} {e.apellido}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{e.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de edición de inscripción */}
      {editInscripcionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setEditInscripcionModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar Inscripción</h2>
            <form onSubmit={e => { e.preventDefault(); handleGuardarEdicionInscripcion(); }}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Estudiante</label>
                <select name="estudianteId" value={editInscripcionForm.estudianteId} onChange={handleEditInscripcionFormChange} className="w-full border rounded-lg px-3 py-2" required>
                  <option value="">Selecciona un estudiante</option>
                  {estudiantes.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre} {e.apellido} ({e.email})</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Curso</label>
                <select name="cursoId" value={editInscripcionForm.cursoId} onChange={handleEditInscripcionFormChange} className="w-full border rounded-lg px-3 py-2" required>
                  <option value="">Selecciona un curso</option>
                  {cursos.map(c => (
                    <option key={c.id} value={c.id}>{c.titulo}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-green-600 text-white hover:bg-green-700">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estudiantes; 
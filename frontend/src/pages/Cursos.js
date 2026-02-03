import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inscripcionService, estudianteService } from '../services/api';
import jsPDF from 'jspdf';

const cursos = [
  {
    id: 1,
    titulo: 'Spring Boot desde Cero',
    mentor: 'Ing. Ana Pérez',
    nivel: 'Básico',
    descripcion: 'Aprende a crear aplicaciones web robustas y seguras con Spring Boot, el framework más popular de Java para desarrollo backend. Incluye fundamentos de REST, seguridad y despliegue en la nube.',
    imagen: '/images/Foto-SpringBoot.jpg',
    color: 'blue',
    horarios: ['Lunes y Miércoles 18:00-20:00', 'Sábados 10:00-13:00'],
    detalles: 'En este curso aprenderás desde la configuración inicial de Spring Boot hasta la creación de APIs REST seguras, integración con bases de datos y despliegue en la nube. Incluye ejercicios prácticos y proyecto final.'
  },
  {
    id: 2,
    titulo: 'Java para Principiantes',
    mentor: 'Ing. Luis Torres',
    nivel: 'Básico',
    descripcion: 'Domina los conceptos esenciales de la programación orientada a objetos con Java. Ideal para quienes inician en el mundo del desarrollo de software.',
    imagen: '/images/Foto-Java.webp',
    color: 'green',
    horarios: ['Martes y Jueves 19:00-21:00', 'Domingos 09:00-12:00'],
    detalles: 'Curso introductorio a Java, cubriendo variables, estructuras de control, POO, colecciones y manejo de archivos. Incluye ejercicios y mini-proyectos.'
  },
  {
    id: 3,
    titulo: 'Programación en Python desde Cero',
    mentor: 'Ing. Ana Pérez',
    nivel: 'Básico',
    descripcion: 'Aprende a programar con Python, uno de los lenguajes más versátiles y demandados. Desde lógica básica hasta manipulación de datos y automatización.',
    imagen: '/images/Foto-Python.jpg',
    color: 'yellow',
    horarios: ['Lunes y Miércoles 20:00-22:00', 'Sábados 14:00-17:00'],
    detalles: 'Aprende Python desde cero: sintaxis, estructuras de datos, funciones, módulos, manejo de archivos y automatización de tareas. Proyecto final de automatización.'
  },
  {
    id: 4,
    titulo: 'Desarrollo Web con React',
    mentor: 'Lic. Carla Mendoza',
    nivel: 'Intermedio',
    descripcion: 'Construye interfaces modernas y dinámicas con React, la librería más usada para frontend. Incluye hooks, rutas, consumo de APIs y despliegue.',
    imagen: '/images/Foto-React.png',
    color: 'red',
    horarios: ['Martes y Jueves 18:00-20:00', 'Sábados 10:00-13:00'],
    detalles: 'Desde componentes básicos hasta hooks avanzados, rutas, consumo de APIs y despliegue en Vercel/Netlify. Incluye proyecto final de SPA.'
  },
  {
    id: 5,
    titulo: 'Aplicaciones Móviles con Flutter',
    mentor: 'Ing. Pablo Ruiz',
    nivel: 'Intermedio',
    descripcion: 'Crea apps móviles nativas para Android y iOS usando Flutter y Dart. Aprende a diseñar, programar y publicar tus propias aplicaciones.',
    imagen: '/images/Foto-Flutter.png',
    color: 'purple',
    horarios: ['Viernes 18:00-21:00', 'Domingos 15:00-18:00'],
    detalles: 'Aprende a crear apps móviles multiplataforma con Flutter: widgets, navegación, consumo de APIs, almacenamiento local y publicación en tiendas.'
  },
  {
    id: 6,
    titulo: 'Machine Learning Aplicado',
    mentor: 'Dra. Sofía Ramírez',
    nivel: 'Avanzado',
    descripcion: 'Descubre el mundo de la inteligencia artificial y el aprendizaje automático. Implementa modelos de Machine Learning con Python y resuelve problemas reales.',
    imagen: '/images/Foto-MachineLearning.jpg',
    color: 'pink',
    horarios: ['Sábados 09:00-13:00', 'Domingos 16:00-20:00'],
    detalles: 'Fundamentos de Machine Learning, modelos supervisados y no supervisados, uso de scikit-learn, proyectos prácticos y análisis de datos reales.'
  },
];

const levelColors = {
  'Básico': 'bg-green-100 text-green-800',
  'Intermedio': 'bg-yellow-100 text-yellow-800',
  'Avanzado': 'bg-red-100 text-red-800',
};

function Cursos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, isStudent, isAdmin } = useAuth();
  const [showPdfButton, setShowPdfButton] = useState(false);
  const [lastInscripcion, setLastInscripcion] = useState(null);
  const [misInscripciones, setMisInscripciones] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [editForm, setEditForm] = useState({ titulo: '', descripcion: '', nivel: '', mentor: '', horarios: '' });

  useEffect(() => {
    const fetchMisInscripciones = async () => {
      if (isAuthenticated && isStudent()) {
        try {
          const res = await inscripcionService.getAll();
          // Filtrar solo las inscripciones del usuario logueado
          const mias = res.data.filter(i => i.estudiante && i.estudiante.id === user.id);
          setMisInscripciones(mias);
        } catch (err) {
          setMisInscripciones([]);
        }
      }
    };
    fetchMisInscripciones();
  }, [isAuthenticated, isStudent, user]);

  const handleVerDetalles = (curso) => {
    setCursoSeleccionado(curso);
    setSelectedHorario('');
    setModalOpen(true);
  };

  const handleInscribirse = async () => {
    if (!isAuthenticated) {
      setModalOpen(false);
      navigate('/register');
    } else if (!isStudent()) {
      alert('Solo los usuarios estudiantes pueden inscribirse en los cursos.');
      setModalOpen(false);
    } else {
      try {
        // Buscar el estudiante por email del usuario logueado
        let res = await estudianteService.getAll();
        let estudiante = res.data.find(e => e.email === user.email);
        // Si no existe, crearlo automáticamente
        if (!estudiante) {
          const nuevoEstudiante = {
            nombre: user.nombre || user.username,
            apellido: user.apellido || '',
            email: user.email,
            grado: '',
            escuela: '',
            telefono: '',
            direccion: ''
          };
          const createRes = await estudianteService.create(nuevoEstudiante);
          estudiante = createRes.data;
        }
        if (!selectedHorario) {
          alert('Por favor, selecciona un horario para inscribirte.');
          return;
        }
        await inscripcionService.create({
          estudiante: { id: estudiante.id },
          curso: { id: cursoSeleccionado.id },
          horario: selectedHorario,
        });
        setLastInscripcion({
          estudiante: user,
          curso: cursoSeleccionado
        });
        setShowPdfButton(true);
        alert('¡Te has inscrito exitosamente en el curso!');
      } catch (error) {
        alert('Error al inscribirse en el curso.');
      }
      setModalOpen(false);
    }
  };

  const handleDescargarPDF = (inscripcion) => {
    if (!inscripcion) return;
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString();
    doc.setFontSize(16);
    doc.text('Comprobante de Inscripción', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de inscripción: ${fecha}`, 20, 30);
    doc.text(`Estudiante: ${inscripcion.estudiante?.nombre || user.nombre || user.username} ${inscripcion.estudiante?.apellido || ''}`.trim(), 20, 45);
    doc.text(`Email: ${inscripcion.estudiante?.email || user.email}`, 20, 55);
    doc.text(`Curso: ${inscripcion.curso?.titulo}`, 20, 65);
    doc.text(`Mentor: ${inscripcion.curso?.mentor}`, 20, 75);
    doc.text(`Nivel: ${inscripcion.curso?.nivel}`, 20, 85);
    doc.text(`Horario: ${inscripcion.horario || 'No especificado'}`, 20, 95);
    if (inscripcion.curso?.horarios) {
      doc.text('Horarios Disponibles del Curso:', 20, 105);
      inscripcion.curso.horarios.forEach((h, i) => {
        doc.text(`- ${h}`, 30, 115 + i * 10);
      });
    }
    doc.save('comprobante_inscripcion.pdf');
  };

  const handleAbrirEditar = (curso) => {
    setCursoEditando(curso);
    setEditForm({
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      nivel: curso.nivel,
      mentor: curso.mentor,
      horarios: curso.horarios || ''
    });
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleGuardarEdicion = async () => {
    try {
      await fetch(`/cursos/${cursoEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      cursoEditando.titulo = editForm.titulo;
      cursoEditando.descripcion = editForm.descripcion;
      cursoEditando.nivel = editForm.nivel;
      cursoEditando.mentor = editForm.mentor;
      cursoEditando.horarios = editForm.horarios;
      setEditModalOpen(false);
      setCursoEditando(null);
      setEditForm({ titulo: '', descripcion: '', nivel: '', mentor: '', horarios: '' });
      alert('Curso actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar el curso');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Apartado de mis cursos inscritos */}
      {isAuthenticated && isStudent() && misInscripciones.length > 0 && (
        <div className="mb-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Mis cursos inscritos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {misInscripciones.map((insc) => (
              <div key={insc.id} className="border rounded-lg p-4 flex flex-col bg-indigo-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{insc.curso?.titulo}</h3>
                <div className="text-sm text-gray-600 mb-2">Mentor: {insc.curso?.mentor}</div>
                <div className="text-sm text-gray-600 mb-2">Nivel: {insc.curso?.nivel}</div>
                <div className="text-sm text-gray-600 mb-2">Horarios: {insc.curso?.horarios?.join(', ')}</div>
                <button
                  className="mt-auto bg-black/70 text-white px-4 py-2 rounded-lg font-semibold hover:bg-black transition-colors"
                  onClick={() => handleDescargarPDF(insc)}
                >
                  Descargar comprobante PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <AcademicCapIcon className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nuestros Cursos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Cursos especializados y diseñados por nuestros mentores para potenciar tus habilidades.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cursos.map((curso, index) => {
          // Verificar si el usuario está inscrito en este curso
          const inscrito = isAuthenticated && isStudent() && misInscripciones.some(i => i.curso && i.curso.id === curso.id);
          return (
            <motion.div
              key={curso.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group"
            >
              <div className="relative">
                <img className="h-48 w-full object-cover" src={curso.imagen} alt={curso.titulo} />
                <div className={`absolute top-0 right-0 mt-2 mr-2 px-2 py-1 text-xs font-bold rounded-full ${levelColors[curso.nivel]}`}>
                  {curso.nivel}
                </div>
                {inscrito && (
                  <div className="absolute top-0 left-0 mt-2 ml-2 px-2 py-1 text-xs font-bold rounded-full bg-green-600 text-white shadow">
                    Curso inscrito
                  </div>
                )}
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{curso.titulo}</h3>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <UserCircleIcon className="h-5 w-5 mr-1.5" />
                  <span>{curso.mentor}</span>
                </div>

                <p className="text-gray-600 mb-4 flex-grow">{curso.descripcion}</p>
                <div className="text-sm text-gray-600 mb-2">Horarios: {curso.horarios}</div>

                <button
                  className={`mt-auto w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-indigo-600 text-white hover:bg-indigo-700`}
                  onClick={() => handleVerDetalles(curso)}
                >
                  Ver Detalles del Curso
                </button>

                {/* Botón de editar solo para admin */}
                {isAuthenticated && isAdmin() && (
                  <div className="mt-2 flex flex-col gap-2">
                    <button
                      className="w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-yellow-500 text-white hover:bg-yellow-600"
                      onClick={() => handleAbrirEditar(curso)}
                    >
                      Editar
                    </button>
                  </div>
                )}

                {inscrito && (
                  <button
                    className="mt-2 w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-black/70 text-white hover:bg-black"
                    onClick={() => {
                      // Buscar la inscripción correspondiente
                      const insc = misInscripciones.find(i => i.curso && i.curso.id === curso.id);
                      handleDescargarPDF(insc);
                    }}
                  >
                    Descargar comprobante PDF
                  </button>
                )}
              </div >
            </motion.div >
          );
        })}
      </div >

      {/* Modal de detalles del curso */}
      {modalOpen && cursoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <img className="h-40 w-full object-cover rounded-lg mb-4" src={cursoSeleccionado.imagen} alt={cursoSeleccionado.titulo} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{cursoSeleccionado.titulo}</h2>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <UserCircleIcon className="h-5 w-5 mr-1.5" />
              <span>{cursoSeleccionado.mentor}</span>
            </div>
            <div className={`mb-2 px-2 py-1 inline-block rounded-full text-xs font-bold ${levelColors[cursoSeleccionado.nivel]}`}>
              {cursoSeleccionado.nivel}
            </div>
            <p className="text-gray-700 mb-4">{cursoSeleccionado.detalles}</p>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">Horarios Disponibles:</h3>
              <select
                value={selectedHorario}
                onChange={(e) => setSelectedHorario(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                required
              >
                <option value="">-- Selecciona un horario --</option>
                {cursoSeleccionado.horarios.map((horario, idx) => (
                  <option key={idx} value={horario}>{horario}</option>
                ))}
              </select>
            </div>
            <button
              className="w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-green-600 text-white hover:bg-green-700"
              onClick={handleInscribirse}
            >
              Inscribirse en el Curso
            </button>
            {isAuthenticated && isStudent() && misInscripciones.some(i => i.curso && i.curso.id === cursoSeleccionado.id) && (
              <button
                className="w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-colors bg-black/70 text-white hover:bg-black"
                onClick={() => {
                  const insc = misInscripciones.find(i => i.curso && i.curso.id === cursoSeleccionado.id);
                  handleDescargarPDF(insc);
                }}
              >
                Descargar comprobante PDF
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de edición de curso */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setEditModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar Curso</h2>
            <form onSubmit={e => { e.preventDefault(); handleGuardarEdicion(); }}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Título</label>
                <input type="text" name="titulo" value={editForm.titulo} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Descripción</label>
                <textarea name="descripcion" value={editForm.descripcion} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Nivel</label>
                <select name="nivel" value={editForm.nivel} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2" required>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Mentor</label>
                <input type="text" name="mentor" value={editForm.mentor} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Horarios (separados por coma)</label>
                <input type="text" name="horarios" value={editForm.horarios} onChange={handleEditFormChange} className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <button type="submit" className="w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-green-600 text-white hover:bg-green-700">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div >
  );
}

export default Cursos; 
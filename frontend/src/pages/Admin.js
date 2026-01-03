import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { contactoService, estudianteService, authService, inscripcionService } from '../services/api';
import jsPDF from 'jspdf';

function Admin() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [mentores, setMentores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [horarioEdit, setHorarioEdit] = useState({});
  const [mentorEdit, setMentorEdit] = useState({});

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      loadMensajes();
      loadEstudiantes();
      loadMentores();
      loadCursos();
      loadInscripciones();
    }
  }, [isAuthenticated, isAdmin]);

  const loadMensajes = async () => {
    try {
      const res = await contactoService.getAll();
      setMensajes(res.data);
    } catch (err) {
      setMensajes([]);
    }
  };

  const loadEstudiantes = async () => {
    try {
      const res = await estudianteService.getAll();
      setEstudiantes(res.data);
    } catch (err) {
      setEstudiantes([]);
    }
  };

  const loadMentores = async () => {
    try {
      const res = await authService.getUsersByRole('MENTOR');
      setMentores(res.data);
    } catch (err) {
      setMentores([]);
    }
  };

  const loadCursos = async () => {
    try {
      const res = await fetch('http://localhost:8080/cursos').then(r => r.json());
      setCursos(res);
    } catch (err) {
      setCursos([]);
    }
  };

  const loadInscripciones = async () => {
    try {
      const res = await inscripcionService.getAll();
      setInscripciones(res.data);
    } catch (err) {
      setInscripciones([]);
    }
  };

  const handleDeleteMensaje = async (id) => {
    if (window.confirm('¿Eliminar este mensaje?')) {
      await contactoService.delete(id);
      loadMensajes();
    }
  };

  const handleDeleteEstudiante = async (id) => {
    if (window.confirm('¿Eliminar este estudiante?')) {
      await estudianteService.delete(id);
      loadEstudiantes();
    }
  };

  const handleDeleteMentor = async (id) => {
    if (window.confirm('¿Eliminar este mentor?')) {
      // Aquí podrías implementar la eliminación de mentores si tienes endpoint
      alert('Funcionalidad de eliminar mentor pendiente de implementar.');
    }
  };

  const handleHorarioChange = (cursoId, value) => {
    setHorarioEdit(prev => ({ ...prev, [cursoId]: value }));
  };

  const handleUpdateHorario = async (curso) => {
    // Aquí deberías tener un endpoint para actualizar el curso
    // Por simplicidad, solo actualizamos en frontend
    alert('Funcionalidad de edición de horarios pendiente de implementar en backend.');
  };

  const handleDeleteInscripcion = async (id) => {
    if (window.confirm('¿Eliminar esta inscripción?')) {
      await fetch(`http://localhost:8080/inscripciones/${id}`, { method: 'DELETE' });
      loadInscripciones();
    }
  };

  const handleUpdateMentor = async (curso) => {
    // Aquí deberías tener un endpoint para actualizar el mentor del curso
    alert('Funcionalidad de edición de mentor pendiente de implementar en backend.');
  };

  if (!isAuthenticated() || !isAdmin()) {
    return <div className="max-w-2xl mx-auto py-12 text-center">Acceso restringido solo para administradores.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">Panel de Administración</h1>

      {/* Mensajes de contacto */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mensajes de Contacto</h2>
        {mensajes.length === 0 ? <p className="text-gray-500">No hay mensajes.</p> : (
          <ul className="space-y-4">
            {mensajes.map(m => (
              <li key={m.id} className="border rounded-lg p-4 flex flex-col bg-indigo-50">
                <div><b>Nombre:</b> {m.nombre}</div>
                <div><b>Email:</b> {m.email}</div>
                <div><b>Mensaje:</b> {m.mensaje}</div>
                <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 w-full md:w-auto" onClick={() => handleDeleteMensaje(m.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Estudiantes */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Estudiantes</h2>
        {estudiantes.length === 0 ? <p className="text-gray-500">No hay estudiantes.</p> : (
          <ul className="space-y-4">
            {estudiantes.map(e => (
              <li key={e.id} className="border rounded-lg p-4 flex flex-col bg-indigo-50">
                <div><b>Nombre:</b> {e.nombre} {e.apellido}</div>
                <div><b>Email:</b> {e.email}</div>
                <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 w-full md:w-auto" onClick={() => handleDeleteEstudiante(e.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Apartado de Mentores Registrados en el Sistema (solo admin) */}
      {isAdmin() && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mentores Registrados en el Sistema</h2>
          {mentores.length === 0 ? <p className="text-gray-500">No hay mentores.</p> : (
            <ul className="space-y-4">
              {mentores.map(m => (
                <li key={m.id} className="border rounded-lg p-4 flex flex-col bg-indigo-50">
                  <div><b>Usuario:</b> {m.username}</div>
                  <div><b>Email:</b> {m.email}</div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                    <label className="font-semibold">Asignar como mentor de curso:</label>
                    <select
                      value={mentorEdit[m.id] || ''}
                      onChange={e => setMentorEdit(prev => ({ ...prev, [m.id]: e.target.value }))}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Selecciona un curso</option>
                      {cursos.map(c => (
                        <option key={c.id} value={c.id}>{c.titulo}</option>
                      ))}
                    </select>
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      onClick={() => handleUpdateMentor(mentorEdit[m.id])}
                    >
                      Asignar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Inscripciones */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Inscripciones</h2>
        {inscripciones.length === 0 ? <p className="text-gray-500">No hay inscripciones.</p> : (
          <ul className="space-y-4">
            {inscripciones.map(insc => (
              <li key={insc.id} className="border rounded-lg p-4 flex flex-col bg-indigo-50">
                <div><b>Estudiante:</b> {insc.estudiante?.nombre} {insc.estudiante?.apellido} ({insc.estudiante?.email})</div>
                <div><b>Curso:</b> {insc.curso?.titulo}</div>
                <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 w-full md:w-auto" onClick={() => handleDeleteInscripcion(insc.id)}>Eliminar Inscripción</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cursos */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cursos</h2>
        {cursos.length === 0 ? <p className="text-gray-500">No hay cursos.</p> : (
          <ul className="space-y-4">
            {cursos.map(c => (
              <li key={c.id} className="border rounded-lg p-4 flex flex-col bg-indigo-50">
                <div><b>Título:</b> {c.titulo}</div>
                <div><b>Mentor:</b> {c.mentor}</div>
                <div><b>Nivel:</b> {c.nivel}</div>
                <div>
                  <b>Horarios:</b>
                  <input
                    type="text"
                    value={horarioEdit[c.id] !== undefined ? horarioEdit[c.id] : (c.horarios || '')}
                    onChange={e => handleHorarioChange(c.id, e.target.value)}
                    className="ml-2 px-2 py-1 border rounded"
                  />
                  <button className="ml-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700" onClick={() => handleUpdateHorario(c)}>Guardar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Admin; 
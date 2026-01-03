import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { inscripcionService } from '../services/api';
import jsPDF from 'jspdf';

function Perfil() {
  const { isAuthenticated, user, isStudent } = useAuth();
  const [misInscripciones, setMisInscripciones] = useState([]);

  useEffect(() => {
    const fetchMisInscripciones = async () => {
      if (isAuthenticated && isStudent()) {
        try {
          const res = await inscripcionService.getAll();
          const mias = res.data.filter(i => i.estudiante && i.estudiante.email === user.email);
          setMisInscripciones(mias);
        } catch (err) {
          setMisInscripciones([]);
        }
      }
    };
    fetchMisInscripciones();
  }, [isAuthenticated, isStudent, user]);

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
    if (inscripcion.curso?.horarios) {
      doc.text('Horarios:', 20, 95);
      inscripcion.curso.horarios.forEach((h, i) => {
        doc.text(`- ${h}`, 30, 105 + i * 10);
      });
    }
    doc.save('comprobante_inscripcion.pdf');
  };

  if (!isAuthenticated || !isStudent()) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Acceso restringido</h2>
        <p>Debes iniciar sesión como estudiante para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">Mi Perfil</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Información personal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Nombre:</span> {user.nombre || user.username}
          </div>
          <div>
            <span className="font-semibold">Apellido:</span> {user.apellido || '-'}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cursos inscritos</h2>
        {misInscripciones.length === 0 ? (
          <p className="text-gray-500">No tienes cursos inscritos aún.</p>
        ) : (
          <div className="space-y-6">
            {misInscripciones.map((insc) => (
              <div key={insc.id} className="border rounded-lg p-4 flex flex-col bg-indigo-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{insc.curso?.titulo}</h3>
                <div className="text-sm text-gray-600 mb-1">Mentor: {insc.curso?.mentor}</div>
                <div className="text-sm text-gray-600 mb-1">Nivel: {insc.curso?.nivel}</div>
                <div className="text-sm text-gray-600 mb-1">Horarios: {insc.curso?.horarios?.join(', ')}</div>
                <button
                  className="mt-2 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold hover:bg-black transition-colors w-full md:w-auto"
                  onClick={() => handleDescargarPDF(insc)}
                >
                  Descargar comprobante PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil; 
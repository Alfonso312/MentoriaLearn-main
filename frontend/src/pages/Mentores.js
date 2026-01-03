import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Mentores() {
  const [mentorSeleccionado, setMentorSeleccionado] = useState(null);
  const mentores = [
    {
      id: 1,
      nombre: 'Ing. Maria Guitierrez Aquino',
      especialidad: 'API Rest full, Spring Boot y Spring Framework, Base de datos, Integración',
      experiencia: '10 años',
      imagen: 'https://newtonendigital.com/wp-content/uploads/2025/03/Mariclet-Fernandez-Profesora-de-Fisica-y-Matematica.jpg',
      descripcion: 'Especialista en desarrollo backend integrando las tecnologías de última generación en proyectos de software. Ha liderado equipos en empresas internacionales y es reconocida por su enfoque práctico y didáctico en la enseñanza de frameworks modernos.',
      formacion: 'Ingeniera de Sistemas por la Universidad Nacional de Ingeniería',
      cursos: ['Spring Boot desde Cero', 'Integración de APIs', 'Bases de Datos'],
    },
    {
      id: 2,
      nombre: 'Ing. Jean Pierre Torres Navarro',
      especialidad: 'Java',
      experiencia: '12 años',
      imagen: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500',
      descripcion: 'Especialista en lenguaje Java para principiantes y avanzados. Ha trabajado en proyectos bancarios y de telecomunicaciones, y es mentor certificado en Java SE y EE.',
      formacion: 'Ingeniero de Software por la PUCP',
      cursos: ['Java para Principiantes', 'Java Avanzado'],
    },
    {
      id: 3,
      nombre: 'Ing. Merlyn Quesquen Manrique',
      especialidad: 'Python para Principiantes',
      experiencia: '10 años',
      imagen: '/images/Profesora-de-Python.webp',
      descripcion: 'Experta en el lenguaje Python, comenzando desde un "Hola Mundo" hasta proyectos avanzados. Ha dictado talleres en universidades y empresas tecnológicas.',
      formacion: 'Ingeniera Informática por la Universidad de Piura',
      cursos: ['Programación en Python desde Cero', 'Automatización con Python'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nuestros Mentores
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Conoce a nuestro equipo de profesionales altamente calificados, comprometidos con tu éxito académico
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentores.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="h-56 overflow-hidden">
              <img
                src={mentor.imagen}
                alt={mentor.nombre}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {mentor.nombre}
              </h3>
              <div className="flex items-center text-indigo-600 mb-2">
                <span className="font-medium">{mentor.especialidad}</span>
                <span className="mx-2">•</span>
                <span>{mentor.experiencia} de experiencia</span>
              </div>
              <p className="text-gray-600 mb-4">{mentor.descripcion}</p>
              <Link 
                to="#"
                onClick={() => setMentorSeleccionado(mentor)}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-block text-center"
              >
                Ver Perfil Completo
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sección de Proceso de Selección */}
      <div className="mt-20 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Nuestro Proceso de Selección
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Evaluación de Credenciales</h3>
            <p className="text-gray-600">
              Verificación exhaustiva de títulos y experiencia profesional
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Entrevista Personal</h3>
            <p className="text-gray-600">
              Evaluación de habilidades pedagógicas y metodología de enseñanza
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Capacitación Continua</h3>
            <p className="text-gray-600">
              Desarrollo profesional constante y actualización metodológica
            </p>
          </div>
        </div>
      </div>

      {/* Modal de perfil completo */}
      {mentorSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setMentorSeleccionado(null)}
            >
              &times;
            </button>
            <img className="h-40 w-full object-contain rounded-lg mb-4" src={mentorSeleccionado.imagen} alt={mentorSeleccionado.nombre} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{mentorSeleccionado.nombre}</h2>
            <div className="text-indigo-700 font-semibold mb-2">Especialidad: {mentorSeleccionado.especialidad}</div>
            <div className="mb-2">Experiencia: {mentorSeleccionado.experiencia}</div>
            <div className="mb-2">Formación: {mentorSeleccionado.formacion}</div>
            <div className="mb-2">Cursos que dicta: {mentorSeleccionado.cursos.join(', ')}</div>
            <p className="text-gray-700 mt-4">{mentorSeleccionado.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mentores; 
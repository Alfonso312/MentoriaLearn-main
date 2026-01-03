import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function PerfilMentor() {
  const { id } = useParams();

  // Datos de los mentores (en un proyecto real esto vendría de una API)
  const mentores = [
    {
      id: 1,
      nombre: 'Dra. María González',
      especialidad: 'Matemáticas y Física',
      experiencia: '15 años',
      imagen: 'https://newtonendigital.com/wp-content/uploads/2025/03/Mariclet-Fernandez-Profesora-de-Fisica-y-Matematica.jpg',
      descripcion: 'Doctora en Física con amplia experiencia en enseñanza de ciencias exactas.',
      perfilCompleto: {
        titulo: 'Doctora en Física Teórica',
        universidad: 'Universidad Nacional Autónoma de México',
        especializaciones: ['Física Cuántica', 'Matemáticas Avanzadas', 'Metodología de Enseñanza'],
        experienciaLaboral: [
          'Profesora titular en la Facultad de Ciencias (2015-2023)',
          'Investigadora en el Instituto de Física (2010-2015)',
          'Mentora en programas de talento matemático (2018-presente)'
        ],
        logros: [
          'Premio Nacional de Enseñanza en Ciencias 2022',
          'Publicación de 25 artículos científicos',
          'Mentora de 150+ estudiantes exitosos'
        ],
        metodologia: 'Soy licenciada en Educación con mención en Física y Matemáticas, egresada de la Universidad de Los Andes, Trujillo, Venezuela, con 15 años de experiencia en el ámbito educativo.',
        areas: ['Álgebra', 'Cálculo', 'Física Mecánica', 'Física Cuántica', 'Preparación para Olimpiadas'],
        horarios: 'Lunes a Viernes: 9:00 AM - 6:00 PM, Sábados: 9:00 AM - 2:00 PM',
        contacto: {
          email: 'maria.gonzalez@mentoria.com',
          telefono: '+52 55 1234 5678',
          linkedin: 'linkedin.com/in/mariagonzalez'
        }
      }
    },
    {
      id: 2,
      nombre: 'Prof. Carlos Rodríguez',
      especialidad: 'Literatura y Redacción',
      experiencia: '12 años',
      imagen: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500',
      descripcion: 'Especialista en desarrollo de habilidades comunicativas y análisis literario.',
      perfilCompleto: {
        titulo: 'Maestro en Literatura Hispanoamericana',
        universidad: 'Universidad de Guadalajara',
        especializaciones: ['Literatura Contemporánea', 'Redacción Académica', 'Análisis Literario'],
        experienciaLaboral: [
          'Profesor de Literatura en Preparatoria (2016-2023)',
          'Editor en Revista Literaria "Palabras" (2018-2022)',
          'Coordinador de Talleres de Escritura (2019-presente)'
        ],
        logros: [
          'Premio Nacional de Literatura Juvenil 2021',
          'Autor de 3 libros de texto para secundaria',
          'Mentor de 200+ estudiantes en concursos literarios'
        ],
        metodologia: 'Mi método se basa en el amor por la lectura y la escritura. Fomento la creatividad y el pensamiento crítico a través del análisis de textos y la práctica constante de la escritura.',
        areas: ['Literatura Universal', 'Redacción Creativa', 'Análisis de Textos', 'Gramática Avanzada', 'Preparación para Exámenes'],
        horarios: 'Lunes a Viernes: 2:00 PM - 8:00 PM, Sábados: 10:00 AM - 4:00 PM',
        contacto: {
          email: 'carlos.rodriguez@mentoria.com',
          telefono: '+52 33 9876 5432',
          linkedin: 'linkedin.com/in/carlosrodriguez'
        }
      }
    },
    {
      id: 3,
      nombre: 'Lic. Ana Martínez',
      especialidad: 'Psicología Educativa',
      experiencia: '10 años',
      imagen: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500',
      descripcion: 'Experta en desarrollo personal y orientación vocacional.',
      perfilCompleto: {
        titulo: 'Licenciada en Psicología Educativa',
        universidad: 'Universidad Autónoma Metropolitana',
        especializaciones: ['Psicología del Desarrollo', 'Orientación Vocacional', 'Terapia Cognitivo-Conductual'],
        experienciaLaboral: [
          'Psicóloga escolar en Colegio San Patricio (2018-2023)',
          'Orientadora vocacional en Universidad Tecnológica (2019-2022)',
          'Terapeuta infantil en Centro de Desarrollo (2020-presente)'
        ],
        logros: [
          'Certificación en Terapia Cognitivo-Conductual 2023',
          'Especialización en Trastornos del Aprendizaje',
          'Mentora de 300+ estudiantes en procesos de autoconocimiento'
        ],
        metodologia: 'Utilizo un enfoque integral que combina técnicas psicológicas con estrategias educativas. Me enfoco en el desarrollo de la autoestima, habilidades sociales y claridad vocacional.',
        areas: ['Desarrollo Personal', 'Orientación Vocacional', 'Habilidades Sociales', 'Manejo de Ansiedad', 'Técnicas de Estudio'],
        horarios: 'Lunes a Viernes: 10:00 AM - 7:00 PM, Sábados: 9:00 AM - 3:00 PM',
        contacto: {
          email: 'ana.martinez@mentoria.com',
          telefono: '+52 55 5555 1234',
          linkedin: 'linkedin.com/in/anamartinez'
        }
      }
    }
  ];

  const mentor = mentores.find(m => m.id === parseInt(id));

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mentor no encontrado</h2>
          <Link to="/mentores" className="text-indigo-600 hover:text-indigo-500">
            Volver a Mentores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón de regreso */}
        <div className="mb-8">
          <Link 
            to="/mentores" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Mentores
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header del perfil */}
          <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative h-full flex items-center px-8">
              <div className="flex items-center">
                <img
                  src={mentor.imagen}
                  alt={mentor.nombre}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                <div className="ml-8 text-white">
                  <h1 className="text-3xl font-bold mb-2">{mentor.nombre}</h1>
                  <p className="text-xl mb-1">{mentor.perfilCompleto.titulo}</p>
                  <p className="text-lg opacity-90">{mentor.especialidad}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna principal */}
              <div className="lg:col-span-2 space-y-8">
                {/* Sobre mí */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre Mí</h2>
                  <p className="text-gray-700 leading-relaxed">{mentor.perfilCompleto.metodologia}</p>
                </section>

                {/* Experiencia Laboral */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Experiencia Laboral</h2>
                  <ul className="space-y-3">
                    {mentor.perfilCompleto.experienciaLaboral.map((exp, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Logros */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Logros y Reconocimientos</h2>
                  <ul className="space-y-3">
                    {mentor.perfilCompleto.logros.map((logro, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{logro}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Áreas de Especialización */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Áreas de Especialización</h2>
                  <div className="flex flex-wrap gap-2">
                    {mentor.perfilCompleto.areas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Información de contacto */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{mentor.perfilCompleto.contacto.email}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{mentor.perfilCompleto.contacto.telefono}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                      <span className="text-gray-700">{mentor.perfilCompleto.contacto.linkedin}</span>
                    </div>
                  </div>
                </div>

                {/* Horarios */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Horarios de Atención</h3>
                  <p className="text-gray-700">{mentor.perfilCompleto.horarios}</p>
                </div>

                {/* Educación */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Educación</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{mentor.perfilCompleto.titulo}</p>
                    <p className="text-gray-700">{mentor.perfilCompleto.universidad}</p>
                  </div>
                </div>

                {/* Especializaciones */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Especializaciones</h3>
                  <ul className="space-y-2">
                    {mentor.perfilCompleto.especializaciones.map((esp, index) => (
                      <li key={index} className="text-gray-700">• {esp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Botón de contacto */}
            <div className="mt-8 text-center">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Contactar Mentor
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PerfilMentor; 
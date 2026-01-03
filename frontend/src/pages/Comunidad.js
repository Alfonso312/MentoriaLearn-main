import React from 'react';
import { motion } from 'framer-motion';
import { ShareIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

// Íconos SVG para redes sociales (puedes reemplazarlos con los tuyos)
const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/CERTUSPERU', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
  </svg> },
  { name: 'Twitter', href: 'https://x.com/certus_oficial', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.216 3.791 4.649-.69.188-1.423.23-2.164.084.616 1.923 2.394 3.328 4.491 3.364-1.791 1.398-4.064 2.182-6.54 2.182-.425 0-.845-.024-1.258-.074 2.308 1.483 5.068 2.35 8.041 2.35 9.491 0 14.681-7.858 14.681-14.681 0-.224 0-.448-.015-.67.951-.688 1.778-1.554 2.433-2.526z" /></svg> },
  { name: 'Instagram', href: 'https://www.instagram.com/certus_oficial/?hl=es', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" /></svg> },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/school/institutocertus/', icon: (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-2.098.4-4.198 3.223-4.198 2.775 0 2.775 2.4-2.775 2.4v10.197h4.969v-8.4c0-4.948-2.684-7.1-6.296-7.1z" /></svg> },
];

function Comunidad() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <ShareIcon className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nuestra Comunidad
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Conecta con nosotros, accede a recursos exclusivos y sé parte de nuestra red de aprendizaje.
        </p>
      </motion.div>

      {/* Sección de Redes Sociales */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Síguenos en Redes Sociales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <item.icon className="h-10 w-10 text-gray-500 group-hover:text-indigo-600 transition-colors" />
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-indigo-800">{item.name}</span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Sección del Aplicativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative rounded-2xl shadow-lg p-8 text-center text-white overflow-hidden"
      >
        {/* Fondo de imagen */}
        <img
          src="/images/Comunidad-certus.webp"
          alt="Fondo Comunidad Certus"
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        />
        {/* Capa de color para mejor legibilidad */}
        <div className="absolute inset-0 bg-indigo-800 opacity-60 z-10"></div>
        <div className="relative z-20">
          <h2 className="text-3xl font-bold mb-4">Accede a Nuestra App Exclusiva</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Descubre herramientas, materiales y una comunidad de estudiantes en nuestra nueva aplicación móvil.
          </p>
          <button
            onClick={() => window.open('https://play.google.com/store/apps/details?id=visiva.certus.certuscontigo&hl=es_PE&pli=1', '_blank')}
            className="relative inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-700 font-bold rounded-lg shadow-md hover:bg-indigo-100 transition-colors"
          >
            <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
            Ir a la Aplicación
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Comunidad; 
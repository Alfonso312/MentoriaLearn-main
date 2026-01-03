import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { contactoService } from '../services/api';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await contactoService.enviarMensaje(formData);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: '¡Mensaje enviado exitosamente! Te responderemos pronto.' });
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Error al enviar el mensaje' });
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error de conexión. Intenta nuevamente.' 
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

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Teléfono',
      content: '+51 928199942',
      description: 'Lunes a Viernes, 9:00 - 18:00',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'www.certus.edu.pe',
      description: 'Respondemos en menos de 24 horas',
    },
    {
      icon: MapPinIcon,
      title: 'Ubicación',
      content: 'Av Industrial 3733',
      description: 'Oficina Central - Sede Norte',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Contáctanos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulario de Contacto */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Envíanos un Mensaje
          </h2>

          {/* Mensaje de estado */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="mensaje"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white`}
            >
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </motion.div>

        {/* Información de Contacto */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <info.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {info.title}
                  </h3>
                  <p className="text-lg text-gray-900 font-medium mb-1">
                    {info.content}
                  </p>
                  <p className="text-gray-600">{info.description}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Mapa o información adicional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Horarios de Atención
            </h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Lunes a Viernes:</strong> 9:00 AM - 6:00 PM</p>
              <p><strong>Sábados:</strong> 9:00 AM - 1:00 PM</p>
              <p><strong>Domingos:</strong> Cerrado</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contacto; 
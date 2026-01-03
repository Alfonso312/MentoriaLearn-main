import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: "🎓",
      title: "Mentores Calificados",
      description: "Profesionales con amplia experiencia en educación y desarrollo personal."
    },
    {
      icon: "👥",
      title: "Programas Personalizados",
      description: "Planes de estudio adaptados a las necesidades individuales de cada estudiante."
    },
    {
      icon: "📈",
      title: "Seguimiento de Progreso",
      description: "Monitoreo constante del avance académico y personal de los estudiantes."
    }
  ];

  const testimonials = [
    {
      quote: "La mentoría ha transformado mi experiencia académica. Ahora tengo más confianza y mejores resultados.",
      name: "María González",
      role: "Estudiante de Ingenieria de Software"
    },
    {
      quote: "Los mentores son increíbles. Me han ayudado a encontrar mi camino y alcanzar mis metas.",
      name: "Carlos Rodríguez",
      role: "Estudiante de Ingenieria de Software"
    },
    {
      quote: "Un programa excepcional que realmente marca la diferencia en la vida de los estudiantes.",
      name: "Ana Martínez",
      role: "Estudiante de Ingenieria de Software"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative text-white py-20"
        style={{
          backgroundImage: "url('/images/Foto-Programacion.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/80 to-indigo-800/70 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl font-bold mb-6">
              Transformando Vidas a través de la Mentoría
            </h1>
            <p className="text-xl mb-8">
              Conectamos estudiantes con mentores dedicados para guiar su camino hacia el desarrollo y diseño de software.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="bg-white text-black/70 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Comenzar Ahora
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros estudiantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-black/70 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
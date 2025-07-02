import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Herramientas Eléctricas', icon: '🔌' },
  { name: 'Construcción', icon: '🏗️' },
  { name: 'Jardinería', icon: '🌱' },
  { name: 'Pinturas', icon: '🎨' },
  { name: 'Ferretería General', icon: '🔩' },
  { name: 'Seguridad', icon: '🦺' },
];

const benefits = [
  { title: 'Despacho rápido', desc: 'Envíos a todo el país en 24-48h.' },
  { title: 'Precios mayoristas', desc: 'Descuentos exclusivos para empresas y profesionales.' },
  { title: 'Compra segura', desc: 'Sitio protegido y múltiples medios de pago.' },
  { title: 'Atención personalizada', desc: 'Soporte experto para ayudarte a elegir.' },
];

const HomeView: React.FC = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Hero principal */}
      <section className="bg-primary text-white py-16 px-4 text-center relative overflow-hidden shadow-vibrant">
        <div className="max-w-3xl mx-auto z-10 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg text-white">¡Todo para tu proyecto en un solo lugar!</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 text-white">Herramientas, materiales y asesoría experta para profesionales y entusiastas. Compra fácil, rápido y seguro.</p>
          <Link to="/catalogo" className="btn-accent text-lg px-8 py-3">Ver Catálogo</Link>
        </div>
        {/* Detalle decorativo */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent opacity-20 rounded-full blur-2xl animate-float pointer-events-none"></div>
      </section>

      {/* Categorías destacadas */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">Categorías Destacadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="card flex flex-col items-center justify-center py-8 hover:shadow-vibrant-hover transition-all cursor-pointer">
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className="text-lg font-semibold text-center text-text-secondary">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-surface py-10 px-4 border-t border-background">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">¿Por qué comprar en Ferremas?</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start space-x-4">
              <div className="bg-accent rounded-full w-10 h-10 flex items-center justify-center text-white text-xl font-bold shadow-vibrant">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary mb-1">{b.title}</h3>
                <p className="text-text-secondary">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer simple */}
      <footer className="mt-auto py-6 text-center text-text-secondary text-sm bg-background border-t border-background">
        © {new Date().getFullYear()} Ferremas. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default HomeView; 
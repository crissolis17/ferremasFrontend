import React from 'react';

const StyleTest: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-ferremas-primary">Prueba de Estilos Ferremas</h1>
      
      {/* Prueba de colores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-ferremas-primary text-white p-4 rounded-lg">
          <h3 className="font-bold">Primary</h3>
          <p>Color principal de Ferremas</p>
        </div>
        <div className="bg-ferremas-secondary text-white p-4 rounded-lg">
          <h3 className="font-bold">Secondary</h3>
          <p>Color secundario de Ferremas</p>
        </div>
        <div className="bg-ferremas-accent text-white p-4 rounded-lg">
          <h3 className="font-bold">Accent</h3>
          <p>Color de acento de Ferremas</p>
        </div>
      </div>

      {/* Prueba de animaciones */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ferremas-primary">Animaciones</h2>
        
        <div className="flex space-x-4">
          <div className="w-20 h-20 bg-ferremas-primary rounded-lg animate-float"></div>
          <div className="w-20 h-20 bg-ferremas-secondary rounded-lg animate-fade-in"></div>
          <div className="w-20 h-20 bg-ferremas-accent rounded-lg animate-slide-in"></div>
        </div>
      </div>

      {/* Prueba de botones */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ferremas-primary">Botones</h2>
        
        <div className="flex space-x-4">
          <button className="btn-primary">Botón Primario</button>
          <button className="btn-secondary">Botón Secundario</button>
          <button className="btn-danger">Botón Peligro</button>
        </div>
      </div>

      {/* Prueba de inputs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ferremas-primary">Inputs</h2>
        
        <div className="space-y-2">
          <input type="text" className="input-field" placeholder="Input normal" />
          <input type="text" className="input-error" placeholder="Input con error" />
        </div>
      </div>

      {/* Prueba de badges */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ferremas-primary">Badges</h2>
        
        <div className="flex space-x-2">
          <span className="badge-success">Éxito</span>
          <span className="badge-warning">Advertencia</span>
          <span className="badge-danger">Peligro</span>
          <span className="badge-info">Info</span>
        </div>
      </div>

      {/* Prueba de gradientes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ferremas-primary">Gradientes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="gradient-primary text-white p-6 rounded-lg">
            <h3 className="font-bold">Gradiente Primario</h3>
          </div>
          <div className="gradient-secondary text-white p-6 rounded-lg">
            <h3 className="font-bold">Gradiente Secundario</h3>
          </div>
        </div>
      </div>

      {/* Prueba de efectos hover */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ferremas-primary">Efectos Hover</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card hover-lift cursor-pointer">
            <h3 className="font-bold">Tarjeta con Hover</h3>
            <p>Pasa el mouse por encima</p>
          </div>
          <div className="bg-ferremas-gray-100 p-4 rounded-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <h3 className="font-bold">Escala en Hover</h3>
            <p>Pasa el mouse por encima</p>
          </div>
          <div className="bg-ferremas-gray-100 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <h3 className="font-bold">Sombra en Hover</h3>
            <p>Pasa el mouse por encima</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleTest; 
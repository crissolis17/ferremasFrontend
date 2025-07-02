import React from 'react';

const ColorTest: React.FC = () => {
  return (
    <div className="p-8 space-y-4">
      {/* Prueba de clase estándar de Tailwind */}
      <div className="bg-red-500 text-white p-4 rounded-lg mb-4">PRUEBA COLOR TAILWIND (bg-red-500)</div>
      
      <h2 className="text-2xl font-bold text-ferremas-primary">Prueba de Colores Ferremas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Colores principales */}
        <div className="bg-ferremas-primary text-white p-4 rounded-lg">
          <h3 className="font-semibold">Primary</h3>
          <p>Color principal de Ferremas</p>
        </div>
        
        <div className="bg-ferremas-secondary text-white p-4 rounded-lg">
          <h3 className="font-semibold">Secondary</h3>
          <p>Color secundario de Ferremas</p>
        </div>
        
        <div className="bg-ferremas-accent text-white p-4 rounded-lg">
          <h3 className="font-semibold">Accent</h3>
          <p>Color de acento</p>
        </div>
        
        {/* Colores de estado */}
        <div className="bg-ferremas-success text-white p-4 rounded-lg">
          <h3 className="font-semibold">Success</h3>
          <p>Color de éxito</p>
        </div>
        
        <div className="bg-ferremas-warning text-white p-4 rounded-lg">
          <h3 className="font-semibold">Warning</h3>
          <p>Color de advertencia</p>
        </div>
        
        <div className="bg-ferremas-danger text-white p-4 rounded-lg">
          <h3 className="font-semibold">Danger</h3>
          <p>Color de peligro</p>
        </div>
        
        {/* Colores de fondo */}
        <div className="bg-ferremas-background border border-ferremas-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold text-ferremas-primary">Background</h3>
          <p className="text-ferremas-gray-600">Color de fondo</p>
        </div>
        
        <div className="bg-ferremas-surface border border-ferremas-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold text-ferremas-primary">Surface</h3>
          <p className="text-ferremas-gray-600">Color de superficie</p>
        </div>
        
        {/* Botones de prueba */}
        <div className="space-y-2">
          <button className="btn-primary w-full">Botón Primary</button>
          <button className="btn-secondary w-full">Botón Secondary</button>
          <button className="btn-danger w-full">Botón Danger</button>
        </div>
        
        {/* Input de prueba */}
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Input de prueba" 
            className="input-field"
          />
          <input 
            type="text" 
            placeholder="Input con error" 
            className="input-error"
          />
        </div>
        
        {/* Badges de prueba */}
        <div className="space-y-2">
          <span className="badge-primary">Badge Primary</span>
          <span className="badge-success">Badge Success</span>
          <span className="badge-warning">Badge Warning</span>
          <span className="badge-danger">Badge Danger</span>
        </div>
      </div>
      
      {/* Gradientes */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-ferremas-primary mb-4">Gradientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="gradient-primary text-white p-6 rounded-lg">
            <h4 className="font-semibold">Gradiente Primary</h4>
            <p>De primary a primary-dark</p>
          </div>
          <div className="gradient-secondary text-white p-6 rounded-lg">
            <h4 className="font-semibold">Gradiente Secondary</h4>
            <p>De secondary a accent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorTest; 
import React from 'react';

interface AnimatedBannerProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  className?: string;
}

const AnimatedBanner: React.FC<AnimatedBannerProps> = ({
  title,
  subtitle,
  icon,
  variant = 'primary',
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-ferremas-primary to-ferremas-blue-600',
    secondary: 'bg-gradient-to-r from-ferremas-secondary to-ferremas-orange-600',
    accent: 'bg-gradient-to-r from-ferremas-accent to-ferremas-orange-500',
    success: 'bg-gradient-to-r from-ferremas-success to-ferremas-green-600'
  };

  const iconStyles = {
    primary: 'text-white',
    secondary: 'text-white',
    accent: 'text-white',
    success: 'text-white'
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-8 ${variantStyles[variant]} ${className}`}>
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-16 -translate-y-16 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-12 translate-y-12 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white opacity-5 rounded-full -translate-x-20 -translate-y-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex items-center space-x-6">
        {icon && (
          <div className={`flex-shrink-0 w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm ${iconStyles[variant]}`}>
            <div className="w-8 h-8">
              {icon}
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-slide-in">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-white text-opacity-90 animate-slide-in" style={{animationDelay: '0.2s'}}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Elementos decorativos adicionales */}
        <div className="hidden lg:block">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>

      {/* Línea decorativa */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-20"></div>
    </div>
  );
};

export default AnimatedBanner; 
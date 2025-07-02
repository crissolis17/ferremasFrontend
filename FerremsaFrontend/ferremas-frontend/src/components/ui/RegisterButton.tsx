import React from 'react';
import { Link } from 'react-router-dom';

interface RegisterButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '',
  children = 'Registrarse'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-ferremas-primary text-white hover:bg-ferremas-primary-dark',
    secondary: 'bg-ferremas-secondary text-white hover:bg-ferremas-accent',
    outline: 'border-2 border-ferremas-primary text-ferremas-primary hover:bg-ferremas-primary hover:text-white'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <Link
      to="/registro"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
};

export default RegisterButton; 
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Azul eléctrico
        secondary: '#ec4899', // Fucsia vibrante
        accent: '#facc15', // Amarillo brillante
        success: '#22d3ee', // Verde lima
        background: '#f9fafb', // Gris muy claro
        surface: '#ffffff', // Blanco
        text: '#1e293b', // Gris oscuro
        'text-secondary': '#64748b', // Gris medio
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vibrant': '0 4px 24px 0 rgba(37,99,235,0.10), 0 1.5px 6px 0 rgba(236,72,153,0.10)',
        'vibrant-hover': '0 8px 32px 0 rgba(37,99,235,0.18), 0 3px 12px 0 rgba(236,72,153,0.18)',
      },
      backgroundImage: {
        'gradient-navbar': 'linear-gradient(90deg, #2563eb 0%, #ec4899 100%)',
        'gradient-btn': 'linear-gradient(90deg, #2563eb 0%, #ec4899 100%)',
        'gradient-banner': 'linear-gradient(90deg, #2563eb 0%, #facc15 100%)',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'spacing': 'margin, padding',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
}
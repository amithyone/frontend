/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'oxford-blue': {
            DEFAULT: '#14213d',
            light: '#1a2a4a',
            dark: '#0f1a2e',
          },
        },
        animation: {
          'slide-up': 'slideUp 0.4s ease-out',
        },
        keyframes: {
          slideUp: {
            '0%': { transform: 'translateY(100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        fontFamily: {
          jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
          inter: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  
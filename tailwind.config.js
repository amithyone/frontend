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
    },
  },
  plugins: [],
};

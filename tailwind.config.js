/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 20px rgba(56,189,248,.5), inset 0 0 20px rgba(139,92,246,.2)',
      },
      animation: {
        pulseGlow: 'pulseGlow 1.6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.35)' },
        },
      },
    },
  },
  plugins: [],
};

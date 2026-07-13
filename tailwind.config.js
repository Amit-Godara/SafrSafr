/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
        teal: {
          DEFAULT: '#14B8A6',
          dark: '#0D9488',
          light: '#2DD4BF',
        },
        cyan: {
          DEFAULT: '#22D3EE',
          dark: '#06B6D4',
          light: '#67E8F9',
        },
        slate: {
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
        },
        danger: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      borderRadius: {
        lg: '20px',
        xl: '26px',
        '2xl': '32px',
      },
      fontSize: {
        display: ['48px', '56px'],
      },
    },
  },
  plugins: [],
};

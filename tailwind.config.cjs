/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['EB Garamond', 'serif'],
      },
      colors: {
        baby_powder: '#fbfef9',
        eerie_black: '#1D1D1D',
        yinmn_blue: '#30577a',
        hunter_green: '#435b35',
        black: {
          DEFAULT: '#000000',
          100: '#000000',
          200: '#000000',
          300: '#000000',
          400: '#000000',
          500: '#000000',
          600: '#333333',
          700: '#666666',
          800: '#999999',
          900: '#cccccc'
        },
        falu_red: {
          DEFAULT: '#7b2d26',
          100: '#190908',
          200: '#32120f',
          300: '#4b1b17',
          400: '#64241f',
          500: '#7b2d26',
          600: '#b24137',
          700: '#ce6960',
          800: '#de9b95',
          900: '#efcdca'
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e6',
          200: '#c2c6cc',
          300: '#9da3ad',
          400: '#757b87',
          500: '#555d6d',
          600: '#434a58',
          700: '#363c47',
          800: '#21242c',
          900: '#171a1f',
          950: '#0d0e11',
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
      },
    },
  },
  plugins: [],
} 
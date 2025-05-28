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
        baby_powder: {
          DEFAULT: '#fbfef9',
          100: '#2b560f',
          200: '#57ad1d',
          300: '#89e14e',
          400: '#c2f0a4',
          500: '#fbfef9',
          600: '#fdfefc',
          700: '#fdfffc',
          800: '#fefffd',
          900: '#fefffe'
        },
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
        yinmn_blue: {
          DEFAULT: '#30577a',
          100: '#091118',
          200: '#132330',
          300: '#1c3449',
          400: '#264561',
          500: '#30577a',
          600: '#427aaa',
          700: '#6b9bc6',
          800: '#9dbdd9',
          900: '#cedeec'
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
        hunter_green: {
          DEFAULT: '#435b35',
          100: '#0d120b',
          200: '#1b2415',
          300: '#283620',
          400: '#35482a',
          500: '#435b35',
          600: '#658850',
          700: '#89ad74',
          800: '#b0c9a2',
          900: '#d8e4d1'
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
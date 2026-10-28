/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#131118',
        surface: '#1c1a23',
        accent: '#ff7a5c',
        accent2: '#ffc76e',
        // warm gray / stone override
        gray: {
          50: '#f7f4f0',
          100: '#ede9e3',
          200: '#d8d2ca',
          300: '#b8b0a7',
          400: '#9a918a',
          500: '#7a716b',
          600: '#5d5551',
          700: '#453f3c',
          800: '#2d2927',
          900: '#1b1917',
        },
      },
    },
  },
  plugins: [],
}

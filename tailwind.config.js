/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A0144B',
          600: '#8E1243',
        },
        bg: '#FFFFFF',
        text: '#1F2937',
      },
      fontSize: {
        'fluid-h1': 'clamp(22px, 5vw, 28px)',
        'fluid-button': 'clamp(14px, 3.6vw, 16px)',
      },
      screens: {
        'mobile': '480px',
        'phablet': '640px',
        'tablet': '1023px',
        'desktop': '1024px',
      },
    },
  },
  plugins: [],
}
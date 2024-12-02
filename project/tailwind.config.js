/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'small-devices': { 'max': '1300px'},
        'large-devices': '1301px',
      },
      blur: {
        xs: '2px',
      },
      fontFamily: {
        body: ['Oswald']
      }
    },
  },
  plugins: [],
};
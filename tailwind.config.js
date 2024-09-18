/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
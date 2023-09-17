/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs':'250px',
      // => @media (min-width: 250px) { ... }

      'sm': '455px',
      // => @media (min-width: 640px) { ... }

      'md': '800px',
      // => @media (min-width: 768px) { ... }

      'lg': '1200px',
      // => @media (min-width: 1536px) { ... }
      'xl': '1400px',

    },
    extend: {},
  },
  plugins: [require("daisyui")],
}


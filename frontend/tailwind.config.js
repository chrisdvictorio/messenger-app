const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
    flowbite.content(),
    ,
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["poppins, sans-serif"],
      },
    },
  },
  plugins: [flowbite.plugin(), require("tailwind-scrollbar")],
};

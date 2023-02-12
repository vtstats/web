// @ts-check
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      mono: ["Fira Code", "monospace"],
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

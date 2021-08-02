module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  important: true,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      lineHeight: {
        12: '3rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

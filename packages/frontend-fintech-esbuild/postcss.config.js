export default {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: ["src/**/*.{js,jsx,ts,tsx}"],
    },
    autoprefixer: {},
  },
};

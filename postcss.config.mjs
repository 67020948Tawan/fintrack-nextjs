/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // เปลี่ยนตรงนี้ครับ
    autoprefixer: {},
  },
};

export default config;
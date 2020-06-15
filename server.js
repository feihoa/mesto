/* eslint no-console: ["error", { allow: ["log"] }] */

const app = require('./app.js');

const { PORT = 3000 } = process.env;


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

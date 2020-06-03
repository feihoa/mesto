const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

// const extractBearerToken = (header) => {
//   return header.replace('Bearer ', '');
// };

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    handleAuthError(res);
  }
  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, 'secret');
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload;

  next();
};

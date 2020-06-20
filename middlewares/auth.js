const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/authorization-err');

const handleAuthError = () => {
  throw new AuthorizationError('Необходима авторизация');
};


module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!req.cookies.jwt) {
    return handleAuthError(res);
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
  return true;
};

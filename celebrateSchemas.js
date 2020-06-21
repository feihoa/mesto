const { celebrate, Joi } = require('celebrate');

const { default: validator } = require('validator');

// signin / signup

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "email" заполнено некоректно');
    }),
    password: Joi.string().required().min(8),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().min(5).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "avatar" заполнено некоректно');
    }),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
});

// users / cards

const validateHeaders = celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
});

// users/

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).pattern(new RegExp('^[0-9a-f]*$')),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "avatar" заполнено некоректно');
    }),
  }),
});

const validateMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

// cards/

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "link" заполнено некоректно');
    }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).pattern(new RegExp('^[0-9a-f]*$')),
  }),
});

module.exports = {
  validateSignIn,
  validateSignUp,
  validateHeaders,
  validateUserId,
  validateAvatar,
  validateMe,
  validateCreateCard,
  validateCardId,
};

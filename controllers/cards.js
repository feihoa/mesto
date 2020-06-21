const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const СastError = require('../errors/cast-err');
const ValidationError = require('../errors/validation-err');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    try {
      const { name, link } = req.body;
      const card = await Card.create({ name, link, owner: req.user._id });
      res.send({ data: card });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      } else {
        throw new Error();
      }
    }
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    try {
      const card = await Card.findById(req.params.cardId)
        .orFail(() => {
          throw new NotFoundError('Нет карточки с таким id');
        });
      if (card.owner.toString() === req.user._id) {
        const removedCard = await card.remove();
        res.send({ data: removedCard });
      } else {
        throw new ForbiddenError('Доступ запрещен');
      }
    } catch (err) {
      if (err.name === 'CastError') {
        throw new СastError('Неверный id');
      } else {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true })
      .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); });
    res.send({ data: card });
  } catch (err) {
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true })
      .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); });
    res.send({ data: card });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};

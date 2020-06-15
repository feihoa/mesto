/* eslint consistent-return: ["error", { "treatUndefinedAsUnspecified": true }] */


const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const СastError = require('../errors/cast-err');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;

    const card = await Card.create({ name, link, owner: req.user._id });
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
    } else {
      next(err);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    try {
      const card = await Card.findById(req.params.cardId)
        .orFail(() => {
          throw new NotFoundError('Нет карточки с таким id');
        });
      if (card.owner.toString() === req.user._id) {
        const removedCard = await card.remove();
        return res.status(200).send({ data: removedCard });
      }
      throw new ForbiddenError('Доступ запрещен');
    } catch (err) {
      if (err.name === 'CastError') {
        throw new СastError('Неверный id');
      } else {
        next(err);
        return true;
      }
    }
  } catch (err) {
    next(err);
    return true;
  }
};


module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true })
      .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); });
    res.status(200).send({ data: card });
  } catch (err) {
    next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true })
      .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); });
    res.status(200).send({ data: card });
  } catch (err) {
    next(err);
  }
};

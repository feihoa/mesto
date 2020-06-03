const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) { res.status(500).send({ message: err.message }); }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;

    const card = await Card.create({ name, link, owner: req.user._id });
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
    }
    res.status(err.statusCode || 500).send({ message: err.message });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId)
      .orFail(() => {
        throw new NotFoundError('Нет карточки с таким id');
      });
    if (card.owner.toString() === req.user._id) {
      try {
        const removedCard = await card.remove();
        res.ststus(200).send({ data: removedCard });
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    } else {
      throw new ForbiddenError('Доступ запрещен');
    }
  } catch (err) {
    res.status(err.statusCode || 500).send({ message: err.message });
  }
};


module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true })
      .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); });
    res.status(200).send({ data: card });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true })
      .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); });
    res.status(200).send({ data: card });
  } catch (err) {
    res.status(err.statusCode || 500).send({ message: err.message });
  }
};

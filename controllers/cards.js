const Card = require('../models/card');


module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards !== null) {
        res.send({ data: cards });
      } else {
        res.status(404).send({ message: 'Not found' });
      }
    })
    .catch(() => res.status(404).send({ message: 'Not found' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })

    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send(err.message));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Not found' });
      }
    })
    .catch(() => res.status(404).send({ message: 'Not found' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send(err.message));
};

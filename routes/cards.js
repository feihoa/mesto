const router = require('express').Router();

const { validateCreateCard, validateCardId } = require('../celebrateSchemas');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// get all cards
router.get('/', getCards);

// create card
router.post('/', validateCreateCard, createCard);

// delete card
router.delete('/:cardId', validateCardId, deleteCard);

// like card
router.put('/:cardId/likes', validateCardId, likeCard);

// dislike card
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;

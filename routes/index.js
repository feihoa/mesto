const router = require('express').Router();

const { validateHeaders } = require('../celebrateSchemas');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', validateHeaders, usersRouter);
router.use('/cards', validateHeaders, cardsRouter);

module.exports = router;

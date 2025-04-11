const express = require('express');
const { getLoans, getLoanById} = require('../controllers/loanController');
const router = express.Router();

router.get('/', getLoans);
router.get('/:id', getLoanById);

module.exports = router;

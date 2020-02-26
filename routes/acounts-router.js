const express = require('express');
const db = require('../data/dbConfig');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const accounts = await db('accounts').select('*');
    res.status(200).json(accounts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

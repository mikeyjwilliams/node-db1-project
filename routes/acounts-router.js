const express = require('express');
const db = require('../data/dbConfig');
const router = express.Router();
const validateAccountData = require('../middleware/validatePostAccountData');

router.get('/', async (req, res, next) => {
  try {
    const accounts = await db('accounts').select('*');
    res.status(200).json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const account = await db('accounts')
      .where({ id: id })
      .select('*')
      .first();
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ message: 'account with ID was not found' });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', validateAccountData(), async (req, res, next) => {
  const { name, budget } = req.body;

  const accountPayload = {
    name: name,
    budget: budget,
  };
  try {
    const [id] = await db('accounts').insert(accountPayload);
    const addedAccount = await db('accounts')
      .where({ id: id })
      .select('*');
    res.status(201).json(addedAccount);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

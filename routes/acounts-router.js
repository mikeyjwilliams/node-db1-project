const express = require('express');
const db = require('../data/dbConfig');
const router = express.Router();
const validateAccountData = require('../middleware/validatePostAccountData');

/**
 * GET: /api/accounts
 * Description: Selects all accounts in `accounts` in  database.
 */
router.get('/', async (req, res, next) => {
  try {
    const accounts = await db('accounts').select('*');
    res.status(200).json(accounts);
  } catch (err) {
    next(err);
  }
});

/**
 * GET: /api/accounts/:id
 * Description:-> selects account matching :id
 * checks if id is available if not `404` error
 * else returns `account` info.
 */
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

/**
 * POST: /api/accounts
 *? Middleware: using validateAccountDate()
 *? => info in `../middleware//validatePostAccountData.js`
 * Description: add destructured name, budget to `accountPayload`
 * returns array with id of insertion.
 * using `id` using where clause on `id` on `accounts` table
 * returning the newly inserted data back w/ a status 201.
 */
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

const express = require('express');
const db = require('../data/dbConfig');
const router = express.Router();
const validateAccountData = require('../middleware/validatePostAccountData');

/**
 * GET: /api/accounts
 * Description: Selects all accounts in `accounts`  database.
 */
router.get('/', async (req, res, next) => {
  let accounts; // inside try/catch -> in if statements checking see which db call to use.
  let numbers;
  let limit = Number(req.query.limit);

  if (limit !== undefined || limit !== NAN) {
    limit = limit;
  }

  try {
    if (limit !== undefined || limit !== NaN) {
      console.log('check');
      console.log(limit, ' ', typeof limit, ' limit name');
      accounts = await db('accounts')
        .select('*')
        .limit(limit);
    } else {
      accounts = await db('accounts').select('*');
    }
    res.status(200).json(accounts);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// limit === undefined && sortby === undefined && sortdir === undefined;

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
      res.status(400).json({ message: 'ID was not found to retrieve' });
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
      .select('*')
      .first();
    res.status(201).json(addedAccount);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/accounts
 * ?? Middleware: validateAccountData()
 * Description: destructure id from req.params
 * destructure name, budget from req.body
 * update where id in accounts with whitelisted body items
 * then grab from accounts where id first object all items
 * check if has id 404 not else returns data.
 */
router.put('/:id', validateAccountData(), async (req, res, next) => {
  const { id } = req.params;
  const { name, budget } = req.body;

  const updateAccount = {
    name: name,
    budget: budget,
  };
  try {
    await db('accounts')
      .where({ id: id })
      .update(updateAccount);
    const newAccount = await db('accounts')
      .where({ id: id })
      .select('*')
      .first();
    if (newAccount) {
      res.status(200).json(newAccount);
    } else {
      res.status(400).json({ message: 'Could not find specific ID to update' });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/projects/:id
 */
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const rowsDel = await db('accounts')
      .where({ id: id })
      .del();
    if (rowsDel) {
      res.status(204).end();
    } else {
      res.status(400).json({ message: 'ID not found to delete' });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;

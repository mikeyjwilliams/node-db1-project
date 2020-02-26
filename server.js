const express = require('express');
const db = require('./data/dbConfig.js');
const server = express();
const accountsRouter = require('./routes/acounts-router');

server.use(express.json());

server.get('/', (req, res) => {
  res.send('accounts is online');
});

server.use('/api/accounts', accountsRouter);

server.use((req, res) => {
  res.status(404).json({ message: '404 page not found' });
});

server.use((err, req, res, next) => {
  res.status(500).json({ errorMessage: 'Internal server error' });
});

module.exports = server;

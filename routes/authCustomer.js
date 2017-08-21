'use strict';

const ev = require('express-validation');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const { camelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/authCustomer', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;

  if (access === 'customer') {
    knex('users')
    .select('*')
    .where({
      id: userId,
      access: access
    })
    .then((result) => {
      const row = camelizeKeys(result);
      res.send(row);
    })
    .catch((err) => {
      next(err)
    });
  }
  else {
    res.sendStatus(401);
  }
});

module.exports = router;

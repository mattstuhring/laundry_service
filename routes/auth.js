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

router.get('/auth', checkAuth, (req, res, next) => {
  console.log(req.token, '************ token');
  const { userId, access } = req.token;

  if (req.token.access === 'customer') {
    knex('customers')
    .select('*')
    .where({
      id: userId,
      access: access
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err)
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;

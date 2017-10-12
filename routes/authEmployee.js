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


router.get('/authEmployee', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  console.log(req.token, '*************** auth employee');

  if (access === 'employee') {
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

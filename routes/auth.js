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
  console.log(res.data, '************** auth');
  res.sendStatus(200);
});

module.exports = router;

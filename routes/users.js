'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/users', (req, res, next) => {
  knex('users')
    .where('id', 1)
    .first()
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      next();
    });
});

module.exports = router;

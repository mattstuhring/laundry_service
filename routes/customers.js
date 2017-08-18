'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/customers', (req, res, next) => {
  knex('customers')
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

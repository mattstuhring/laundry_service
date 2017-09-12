'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');
const router = express.Router();



router.put('/adminDeleteOrder', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { selectedOrders } = req.body

  if (access === 'admin') {

    for (let i = 0; i < selectedOrders.length; i++) {
      knex('orders')
        .where('orders.id', selectedOrders[i].id)
        .del()
        .then((r) => {
          console.log(r);;
        })
        .catch((err) => {
          next(err);
        });
    }

    res.sendStatus(200);
  }
  else {
    res.sendStatus(401);
  }
});

module.exports = router;

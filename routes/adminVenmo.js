'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');
const router = express.Router();


router.put('/adminVenmo', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { selectedVenmoOrders } = req.body

  // console.log(selectedVenmoOrders, '******** selected venmo');

  if (access === 'admin') {

    for (let i = 0; i < selectedVenmoOrders.length; i++) {
      knex('payments')
        .where('payments.id', selectedVenmoOrders[i].payment_id)
        .update({
          received: true
        })
        .then((r) => {
          console.log(r, '************** r');;
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

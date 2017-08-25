'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');

const router = express.Router();

// GET ALL ORDERS
router.get('/orders', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;

  if (access === 'customer') {
    knex('orders')
      .select('*')
      .innerJoin('payments', 'orders.payment_id', 'payments.id')
      .where('customer_id', userId)
      .where('status', 'Queue')
      .orderBy('orders.id', 'desc')
      .then((queue) => {
        console.log(queue, '*********** queue');
        let orders = [queue];
        return knex('orders')
          .select('*')
          .innerJoin('payments', 'orders.payment_id', 'payments.id')
          .where('customer_id', userId)
          .where('status', 'Complete')
          .orderBy('orders.id', 'desc')
          .then((complete) => {
            console.log(complete, '*********** complete');
            orders.push(complete);

            res.send(orders);
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.sendStatus(401);
  }
});


// CREATE NEW ORDER
router.post('/orders', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { address } = req.body;

  if (access === 'customer') {
    knex('payments')
      .insert({
        type: '',
        amount: null
      })
      .returning('id')
      .then((paymentId) => {
        return knex('orders')
          .insert({
            customer_id: userId,
            payment_id: parseInt(paymentId[0]),
            address: address,
            status: 'Queue'
          })
          .returning('id')
          .then((orderId) => {
            return knex('orders')
              .where('id', parseInt(orderId[0]))
              .then((r) => {
                res.send(r[0]);
              })
              .catch((err) => {
                next(err);
              });
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;

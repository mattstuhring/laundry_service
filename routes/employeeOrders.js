'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');

const router = express.Router();

// GET ALL EMPLOYEE ORDERS
router.get('/employeeOrders', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;

  if (access === 'employee') {
    knex('orders')
      .select('*')
      .innerJoin('payments', 'orders.payment_id', 'payments.id')
      .where('status', 'Queue')
      .orderBy('orders.id', 'desc')
      .then((queue) => {
        let orders = [queue];

        return knex('orders')
          .select('*')
          .innerJoin('payments', 'orders.payment_id', 'payments.id')
          .where('employee_id', userId)
          .where('status', 'Complete')
          .orderBy('orders.id', 'desc')
          .then((complete) => {
            orders.push(complete);

            return knex('orders')
              .select('*')
              .innerJoin('payments', 'orders.payment_id', 'payments.id')
              .where('employee_id', userId)
              .where('status', 'Active')
              .orderBy('orders.id', 'desc')
              .then((active) => {
                orders.push(active);

                res.send(orders);
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



router.put('/employeeOrders', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { orderId, check } = req.body;
  let status;

  if (check === 'active') {
    status = 'Active';
  } else if (check === 'complete') {
    status = 'Complete';
  }

  if (access === 'employee') {
    knex('orders')
    .where('orders.id', orderId)
    .update({
      status: status,
      employee_id: userId
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
  } else {
    res.sendStatus(401);
  }

});


// DELETE ORDER BY ID
router.delete('/employeeOrders/:id', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;

  if (access === 'employee') {
    knex('orders')
    .where('orders.id', req.params.id)
    .update({
      status: 'Queue',
      employee_id: null
    })
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
  }
  else {
    res.sendStatus(401);
  }
});

module.exports = router;

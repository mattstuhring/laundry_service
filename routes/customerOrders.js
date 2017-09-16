'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');

const router = express.Router();

// GET ALL ORDERS
router.get('/customerOrders', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;

  if (access === 'customer') {
    knex('orders')
      .select('*')
      .innerJoin('payments', 'orders.payment_id', 'payments.id')
      .where('customer_id', userId)
      .where('status', 'Queue')
      .orWhere('status', 'Active')
      .innerJoin('settings', 'orders.setting_id', 'settings.id')
      .innerJoin('tasks', 'orders.task_id', 'tasks.id')
      .innerJoin('pickups', 'orders.pickup_id', 'pickups.id')
      .orderBy('orders.id', 'desc')
      .then((queue) => {
        let orders = [queue];

        return knex('orders')
          .select('*')
          .innerJoin('payments', 'orders.payment_id', 'payments.id')
          .where('customer_id', userId)
          .where('status', 'Complete')
          .innerJoin('settings', 'orders.setting_id', 'settings.id')
          .innerJoin('tasks', 'orders.task_id', 'tasks.id')
          .innerJoin('pickups', 'orders.pickup_id', 'pickups.id')
          .orderBy('orders.id', 'desc')
          .then((complete) => {
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
router.post('/customerOrders', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { customerAddress, customerPhoneNumber, orderInstructions, orderPickupDate, orderPaymentAmount, orderPickupTime } = req.body.newOrder;

  console.log(orderPickupTime, '******************* time');

  let orderLoads = parseInt(req.body.newOrder.orderLoads);
  let { orderServices } = req.body.newOrder;
  let clean, fold = false;

  if (orderServices.includes('clean')) {
    clean = true;
  }

  if (orderServices.includes('fold')) {
    fold = true;
  }

  let arr = [];

  if (access === 'customer') {
    knex('payments')
      .insert({
        type: 'Credit',
        amount: orderPaymentAmount
      })
      .returning('id')
      .then((paymentId) => {
        arr.push(paymentId);

        return knex('settings')
          .insert({
            amount: orderLoads,
            clean: clean,
            fold: fold
          })
          .returning('id')
          .then((settingId) => {
            arr.push(settingId);

            return knex('tasks')
              .insert({
                pickup: null,
                wash_dry: null,
                dropoff: null,
              })
              .returning('id')
              .then((taskId) => {
                arr.push(taskId)

                return knex('pickups')
                  .insert({
                    date: orderPickupDate,
                    time: orderPickupTime,
                  })
                  .returning('id')
                  .then((pickupId) => {
                    arr.push(pickupId);

                    return knex('orders')
                      .insert({
                        customer_id: parseInt(userId),
                        payment_id: parseInt(arr[0][0]),
                        setting_id: parseInt(arr[1][0]),
                        address: customerAddress,
                        instructions: orderInstructions,
                        status: 'Queue',
                        step: 'Queue',
                        task_id: parseInt(arr[2][0]),
                        pickup_id: parseInt(arr[3][0])
                      })
                      .returning('id')
                      .then((orderId) => {
                        return knex('orders')
                          .select('*')
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
    }
    else {
      res.sendStatus(401);
    }
});



// DELETE ORDER BY ID
router.delete('/customerOrders/:id', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { id } = req.params;

  if (access === 'customer' || access === 'admin') {
    knex('orders')
      .where('orders.id', id)
      .del()
      .then(() => {
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

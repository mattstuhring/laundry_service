'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();



// GET ALL ORDERS
router.get('/customerOrders', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;

  if (access === 'customer') {
    knex('orders')
      .select(['orders.id', 'orders.customer_id', 'orders.employee_id', 'orders.address', 'orders.status', 'orders.step', 'orders.time', 'orders.instructions', 'orders.created_at', 'orders.updated_at','users.first_name', 'users.phone_number', 'settings.amount', 'settings.clean', 'settings.fold', 'tasks.pickup', 'tasks.wash_dry', 'tasks.dropoff', ])
      .where({
        customer_id: userId,
        status: 'Queue'
      })
      .orWhere({
        customer_id: userId,
        status: 'Active'
      })
      .innerJoin('settings', 'orders.setting_id', 'settings.id')
      .innerJoin('tasks', 'orders.task_id', 'tasks.id')
      .leftJoin('users', 'orders.employee_id', 'users.id')
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
  const { customerEmail, customerAddress, customerPhoneNumber, orderInstructions, orderPickupDate, orderPickupTime, paymentType, paymentReceived } = req.body.newOrder;


  let orderLoads = parseInt(req.body.newOrder.orderLoads);
  let orderTotalCost = parseInt(req.body.newOrder.orderTotalCost);
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
        received: paymentReceived,
        type: paymentType,
        total: orderTotalCost
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

                return knex('orders')
                  .insert({
                    customer_id: parseInt(userId),
                    payment_id: parseInt(arr[0][0]),
                    setting_id: parseInt(arr[1][0]),
                    task_id: parseInt(arr[2][0]),
                    address: customerAddress,
                    instructions: orderInstructions,
                    time: orderPickupTime,
                    status: 'Queue',
                    step: 'Queue',
                    employee_id: null
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

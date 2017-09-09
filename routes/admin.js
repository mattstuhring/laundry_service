'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');

const router = express.Router();

// GET ALL EMPLOYEE ORDERS
router.get('/admin', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;

  if (access === 'admin') {
    knex('orders')
      .select('*')
      .innerJoin('payments', 'orders.payment_id', 'payments.id')
      .where('status', 'Queue')
      .innerJoin('settings', 'orders.setting_id', 'settings.id')
      .innerJoin('tasks', 'orders.task_id', 'tasks.id')
      .orderBy('orders.id', 'desc')
      .then((queue) => {
        let orders = [queue];

        return knex('orders')
          .select('*')
          .innerJoin('payments', 'orders.payment_id', 'payments.id')
          .where('status', 'Complete')
          .innerJoin('settings', 'orders.setting_id', 'settings.id')
          .innerJoin('tasks', 'orders.task_id', 'tasks.id')
          .orderBy('orders.id', 'desc')
          .then((complete) => {
            orders.push(complete);

            return knex('orders')
              .select('*')
              .where('status', 'Active')
              .innerJoin('payments', 'orders.payment_id', 'payments.id')
              .innerJoin('settings', 'orders.setting_id', 'settings.id')
              .innerJoin('tasks', 'orders.task_id', 'tasks.id')
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










router.put('/admin', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { selectedQueueOrders, check } = req.body;
  let orderStatus;
  let stepName;
  let column;


  if (access === 'admin') {

    for (let i = 0; i < selectedQueueOrders.length; i++) {

      if (check === 'active') {
        orderStatus = 'Active';
      } else if (check === 'complete') {
        orderStatus = 'Complete';
      }

      if (selectedQueueOrders[i].step === 'Queue') {
        stepName = 'Pick-up';
      } else if (selectedQueueOrders[i].step === 'Drop-off') {
        stepName = 'Drop-off';
      }

      knex('orders')
        .where('orders.id', selectedQueueOrders[i].id)
        .update({
          status: orderStatus,
          step: stepName,
          employee_id: parseInt(userId)
        })
        .then(() => {
          if (stepName === 'Pick-up') {
            column = {pickup: selectedQueueOrders[i].id};
          } else if (stepName === 'Cleaning') {
            column = {wash_dry: selectedQueueOrders[i].id};
          } else if (stepName === 'Drop-off') {
            column = {dropoff: selectedQueueOrders[i].id};
          } else {
            column = {dropoff: selectedQueueOrders[i].id};
          }

          return knex('tasks')
            .where('tasks.id', selectedQueueOrders[i].task_id)
            .update(column)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              next(err);
            });
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








router.post('/admin', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { selectedActiveOrders } = req.body;
  let stepName;

  console.log(selectedActiveOrders, '********** selected');

  if (access === 'admin') {

    for (let i = 0; i < selectedActiveOrders.length; i++) {

      if (selectedActiveOrders[i].step === 'Pick-up') {
        stepName = 'Cleaning';
      } else if (selectedActiveOrders[i].step === 'Cleaning') {
        stepName = 'Drop-off';
      } else if (selectedActiveOrders[i].step === 'Drop-off') {
        stepName = 'Complete';
      }

      if (stepName === 'Complete') {
        knex('orders')
          .where('orders.id', selectedActiveOrders[i].id)
          .update({
            status: 'Complete'
          })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            next(err);
          });
      }
      else {
        knex('orders')
          .where('orders.id', selectedActiveOrders[i].id)
          .update({
            status: 'Queue',
            step: stepName
          })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            next(err);
          });
      }
    }

    res.sendStatus(200);
  }
  else {
    res.sendStatus(401);
  }
});








router.delete('/admin/:orderId/:orderStep', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { orderId, orderStep } = req.params;
  let stepName;

  if (access === 'admin') {

    if (orderStep === 'Queue') {
      stepName = 'Queue';
    } else if (orderStep === 'Pick-up') {
      stepName = 'Queue';
    } else if (orderStep === 'Cleaning') {
      stepName = 'Pick-up';
    } else if (orderStep === 'Drop-off') {
      stepName = 'Cleaning';
    } else if (orderStep === 'Complete') {
      stepName = 'Complete';
    }

    if (stepName === 'Complete') {
      knex('orders')
        .where('orders.id', orderId)
        .update({
          status: 'Complete'
        })
        .then((result) => {
          res.sendStatus(200);
        })
        .catch((err) => {
          next(err);
        });
    }
    else {
      knex('orders')
        .where('orders.id', orderId)
        .update({
          status: 'Queue',
          step: stepName
        })
        .then((result) => {
          res.sendStatus(200);
        })
        .catch((err) => {
          next(err);
        });
    }
  }
  else {
    res.sendStatus(401);
  }
});

module.exports = router;

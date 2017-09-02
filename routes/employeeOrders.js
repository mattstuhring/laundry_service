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
              .where('employee_id', userId)
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



router.put('/employeeOrders', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { orderId, check, orderStep, taskId } = req.body;
  let orderStatus;
  let stepName;
  let column;

  if (access === 'employee') {

    if (check === 'active') {
      orderStatus = 'Active';
    } else if (check === 'complete') {
      orderStatus = 'Complete';
    }

    if (orderStep === 'Queue') {
      stepName = 'Pick-up';
    } else if (orderStep === 'Drop-off') {
      stepName = 'Drop-off';
    }

    knex('orders')
      .where('orders.id', orderId)
      .update({
        status: orderStatus,
        step: stepName,
        employee_id: parseInt(userId)
      })
      .then(() => {
        if (stepName === 'Pick-up') {
          column = {pickup: orderId};
        } else if (stepName === 'Cleaning') {
          column = {wash_dry: orderId};
        } else if (stepName === 'Drop-off') {
          column = {dropoff: orderId};
        } else {
          column = {dropoff: orderId};
        }

        return knex('tasks')
          .where('tasks.id', taskId)
          .update(column)
          .then(() => {
            res.sendStatus(200);
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


// EMPLOYEE COMPLETED TASK -> MOVE TO NEXT TASK
router.post('/employeeOrders/:orderId/:orderStep', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { orderId, orderStep } = req.params;
  let stepName;

  if (access === 'employee') {

    if (orderStep === 'Pick-up') {
      stepName = 'Cleaning';
    } else if (orderStep === 'Cleaning') {
      stepName = 'Drop-off';
    } else if (orderStep === 'Drop-off') {
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



router.delete('/employeeOrders/:orderId/:orderStep', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { orderId, orderStep } = req.params;
  let stepName;

  if (access === 'employee') {

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

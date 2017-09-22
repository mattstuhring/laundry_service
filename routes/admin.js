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



// GET ALL ORDERS -> queue, active, complete
router.get('/admin', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;

  if (access === 'admin') {
    knex('orders')
      .select(['orders.id', 'orders.customer_id', 'orders.employee_id', 'orders.address', 'orders.created_at', 'orders.updated_at', 'orders.time', 'orders.step', 'orders.status', 'orders.instructions', 'orders.task_id', 'settings.amount', 'settings.clean', 'settings.fold', 'tasks.pickup', 'tasks.wash_dry', 'tasks.dropoff', 'users.first_name', 'users.last_name', 'users.phone_number', 'users.email', 'payments.total'])
      .innerJoin('payments', 'orders.payment_id', 'payments.id')
      .where('status', 'Queue')
      .innerJoin('settings', 'orders.setting_id', 'settings.id')
      .innerJoin('tasks', 'orders.task_id', 'tasks.id')
      .innerJoin('users', 'orders.customer_id', 'users.id')
      .orderBy('orders.id', 'desc')
      .then((queue) => {
        let orders = [queue];

        return knex('orders')
          .select(['orders.id', 'orders.customer_id', 'orders.employee_id', 'orders.address', 'orders.created_at', 'orders.updated_at', 'orders.time', 'orders.step', 'orders.status', 'orders.instructions', 'orders.task_id', 'settings.amount', 'settings.clean', 'settings.fold', 'tasks.pickup', 'tasks.wash_dry', 'tasks.dropoff', 'users.first_name', 'users.last_name', 'users.phone_number', 'users.email', 'payments.total'])
          .innerJoin('payments', 'orders.payment_id', 'payments.id')
          .where('status', 'Complete')
          .innerJoin('settings', 'orders.setting_id', 'settings.id')
          .innerJoin('tasks', 'orders.task_id', 'tasks.id')
          .innerJoin('users', 'orders.customer_id', 'users.id')
          .orderBy('orders.id', 'desc')
          .then((complete) => {
            orders.push(complete);

            return knex('orders')
              .select(['orders.id', 'orders.customer_id', 'orders.employee_id', 'orders.address', 'orders.created_at', 'orders.updated_at', 'orders.time', 'orders.step', 'orders.status', 'orders.instructions', 'orders.task_id', 'settings.amount', 'settings.clean', 'settings.fold', 'tasks.pickup', 'tasks.wash_dry', 'tasks.dropoff', 'users.first_name', 'users.last_name', 'users.phone_number', 'users.email', 'payments.total'])
              .where('status', 'Active')
              .innerJoin('payments', 'orders.payment_id', 'payments.id')
              .innerJoin('settings', 'orders.setting_id', 'settings.id')
              .innerJoin('tasks', 'orders.task_id', 'tasks.id')
              .innerJoin('users', 'orders.customer_id', 'users.id')
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




// ACCEPTING A NEW ORDER -> Update orders status from QUEUE to ACTIVE
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
      } else if (selectedQueueOrders[i].step === 'Pick-up') {
        stepName = 'Pick-up';
      }else if (selectedQueueOrders[i].step === 'Cleaning') {
        stepName = 'Cleaning';
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
            column = {pickup: parseInt(userId)};
          } else if (stepName === 'Cleaning') {
            column = {wash_dry: parseInt(userId)};
          } else if (stepName === 'Drop-off') {
            column = {dropoff: parseInt(userId)};
          } else {
            column = {dropoff: parseInt(userId)};
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






// COMPLETING AN ORDER TASK -> Update orders status from ACTIVE to QUEUE
router.post('/admin', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { selectedActiveOrders } = req.body;
  let stepName;

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
            console.log('Uncomment Nodemailer in ROUTE admin.js');

            // var transporter = nodemailer.createTransport(smtpTransport({
            //   service: 'Gmail',
            //   auth: {
            //     user: process.env.GMAIL_USER,
            //     pass: process.env.GMAIL_PASSWORD
            //   }
            // }));
            //
            // let mailOptions = {
            //    from: process.env.GMAIL_USER,
            //    to: process.env.GMAIL_USER,
            //    subject: 'Laundry Service - Completed Order',
            //    text: `Completed order #: ${selectedActiveOrders[i].id}`
            // };
            //
            // transporter.sendMail(mailOptions, (error, info) => {
            //   if (error) {
            //     console.log(error);
            //     return;
            //   }
            //
            //   console.log('Message %s sent: %s', info.messageId, info.response);
            //   transporter.close();
            // });
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


module.exports = router;

'use strict';

const knex = require('../knex');
const express = require('express');
const boom = require('boom');
const { checkAuth } = require('./auth-middleware');
const router = express.Router();




router.put('/employeeRemoveOrder', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const {selectedActiveOrders} = req.body
  let stepName;
  let column;

  if (access === 'employee') {

    for (let i = 0; i < selectedActiveOrders.length; i++) {

      if (selectedActiveOrders[i].step === 'Queue') {
        stepName = 'Queue';
      } else if (selectedActiveOrders[i].step === 'Pick-up') {
        stepName = 'Queue';
      } else if (selectedActiveOrders[i].step === 'Cleaning') {
        stepName = 'Pick-up';
      } else if (selectedActiveOrders[i].step === 'Drop-off') {
        stepName = 'Cleaning';
      }

      knex('orders')
        .where('orders.id', selectedActiveOrders[i].id)
        .update({
          status: 'Queue',
          step: stepName,
          employee_id: null
        })
        .then((result) => {
          console.log(result);

          if (stepName === 'Queue') {
            column = {pickup: null};
          } else if (stepName === 'Pick-up') {
            column = {pickup: null};
          } else if (stepName === 'Cleaning') {
            column = {wash_dry: null};
          } else if (stepName === 'Drop-off') {
            column = {dropoff: null};
          } else {
            column = {dropoff: null};
          }

          return knex('tasks')
            .where('tasks.id', selectedActiveOrders[i].task_id)
            .update(column)
            .then((r) => {
              console.log(r);
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

module.exports = router;

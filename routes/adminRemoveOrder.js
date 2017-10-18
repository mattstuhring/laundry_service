'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');

const router = express.Router();





router.put('/adminRemoveOrder', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const {selectedOrders} = req.body
  let stepName;
  let column;

  if (access === 'admin') {

    for (let i = 0; i < selectedOrders.length; i++) {

      if (selectedOrders[i].step === 'Queue') {
        stepName = 'Queue';
      } else if (selectedOrders[i].step === 'Pick-up') {
        stepName = 'Queue';
      } else if (selectedOrders[i].step === 'Cleaning') {
        stepName = 'Pick-up';
      } else if (selectedOrders[i].step === 'Drop-off') {
        stepName = 'Cleaning';
      } else if (selectedOrders[i].step === 'Complete') {
        stepName = 'Complete';
      }

      if (stepName === 'Complete') {
        knex('orders')
          .where('orders.id', selectedOrders[i].id)
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
          .where('orders.id', selectedOrders[i].id)
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
              .where('tasks.id', selectedOrders[i].task_id)
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
    }

    res.sendStatus(200);
  }
  else {
    res.sendStatus(401);
  }
});

module.exports = router;

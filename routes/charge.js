'use strict';

const stripe = require('../constants/stripe');
const knex = require('../knex');
const express = require('express');
const { checkAuth } = require('./auth-middleware');

const router = express.Router();



router.post('/charge', (req, res, next) => {


  const { source, amount, description } = req.body;

  stripe.charges.create({
    amount: amount,
    description: description,
    currency: 'USD',
    source: source
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    next(err);
  });

  // stripe.customers.create({
  //      email: req.body.stripeEmail,
  //     source: req.body.stripeToken
  //   })
  //   .then(customer =>
  //     stripe.charges.create({
  //       amount: req.body.amount,
  //       description: "Sample Charge",
  //          currency: "usd",
  //          customer: customer.id
  //     }))
  //   .then(() => {
  //     res.sendStatus(200);
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
});



module.exports = router;

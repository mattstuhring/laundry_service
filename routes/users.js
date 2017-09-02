'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');
const router = express.Router();




router.get('/users', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  let persons = [];

  if (access === 'admin') {

    knex('users')
      .select('id', 'first_name', 'last_name', 'address', 'email', 'phone_number', 'created_at')
      .where('access', 'customer')
      .then((c) => {
        persons.push(c);

        return knex('users')
          .select('id', 'first_name', 'last_name', 'email', 'phone_number', 'created_at')
          .where('access', 'employee')
          .then((e) => {
            persons.push(e);

            res.send(persons)
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  }
});




// CREATE NEW CUSTOMER
router.post('/users', (req, res, next) => {
  const { firstName, lastName, address, email, phoneNumber, password } = req.body;

  knex('users')
    .select(knex.raw('1=1'))
    .where('email', email)
    .first()
    .then((exists) => {
      if (exists) {
        throw boom.create(400, 'Email already exists.');
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const newUser = { firstName, lastName, address, email, phoneNumber, hashedPassword, access: 'customer' };
      const row = decamelizeKeys(newUser);

      return knex('users')
        .insert(row, '*');
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
});



// UPDATE USER TO EMPLOYEE ACCESS
router.put('/users', checkAuth, (req, res, next) => {
  const { access } = req.token;
  const { userId } = req.body;

  if (access === 'admin') {
    knex('users')
      .where('id', userId)
      .update({
        access: 'employee'
      })
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




// DELETE USER BY ID
router.delete('/users/:removeUserId', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { removeUserId } = req.params;

  if (access === 'admin') {
    knex('users')
      .where('id', removeUserId)
      .update({
        access: ''
      })
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

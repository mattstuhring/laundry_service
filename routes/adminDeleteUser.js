'use strict';

const knex = require('../knex');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');

const router = express.Router();





router.put('/adminDeleteUser', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const {selectedUsers} = req.body

  if (access === 'admin') {

    for (let i = 0; i < selectedUsers.length; i++) {
      knex('users')
        .where('id', selectedUsers[i].id)
        .update({
          access: '',
          email: selectedUsers[i].id.toString()
        })
        .then(() => {
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

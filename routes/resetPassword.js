'use strict';

const ev = require('express-validation');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const { camelizeKeys } = require('humps');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require('crypto');
const router = express.Router();


router.put('/resetPassword', (req, res, next) => {
  const { password, token } = req.body;

  knex('users')
    .select('*')
    .where('reset_password_token', token)
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Error!');
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      return knex('users')
        .where('reset_password_token', token)
        .update({
          hashed_password: hashedPassword
        })
        .then(() => {
          res.sendStatus(200)
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

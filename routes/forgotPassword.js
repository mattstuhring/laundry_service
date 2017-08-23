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


router.post('/forgotPassword', (req, res, next) => {
  knex('users')
    .where('email', req.body.email)
    .first()
    .then((row) => {

      if (!row) {
        throw boom.create(401, 'Invalid email address');
      }

      crypto.randomBytes(20, function(err, buffer) {
        if (!row) {
          throw boom.create(500, 'Server error');
        }

        const token = buffer.toString('hex');

        knex('users')
          .where('email', req.body.email)
          .update({
            reset_password_token: token
          })
          .then((result) => {
            var transporter = nodemailer.createTransport(smtpTransport({
              service: 'Gmail',
              auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
              }
            }));

            let mailOptions = {
               from: process.env.GMAIL_USER,
               to: process.env.GMAIL_USER,
               subject: 'Laundry Service - forgot password',
               text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/resetPassword?token=' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                return;
              }

              console.log('Message %s sent: %s', info.messageId, info.response);
              transporter.close();
              res.sendStatus(200);
            });
          })
          .catch((err) => {
            next(err);
          })
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

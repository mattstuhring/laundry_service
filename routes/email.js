'use strict';

const knex = require('../knex');
const express = require('express');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();



// EMAIL NOTIFICATION TO ADMIN & EMPLOYEES FOR NEW ORDERS
router.post('/email', (req, res, next) => {
  const { email, message } = req.body;
  console.log(req.body, '********* req body')

  console.log('Uncomment nodemailer in ROUTE email.js');
  res.sendStatus(200);

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
  //    subject: 'Laundry Service - Question',
  //    text: `My question is. . .`
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
});


module.exports = router;

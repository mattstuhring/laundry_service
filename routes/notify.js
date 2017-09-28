'use strict';

const knex = require('../knex');
const express = require('express');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const { checkAuth } = require('./auth-middleware');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const router = express.Router();



// EMAIL NOTIFICATION TO ADMIN & EMPLOYEES FOR NEW ORDERS
router.post('/notify', checkAuth, (req, res, next) => {
  const { userId, access } = req.token;
  const { customerAddress, orderServices, orderLoads, customerPhoneNumber, orderInstructions, orderPickupDate, orderPaymentTotal, orderPickupTime } = req.body.newOrder;

  let orderId = parseInt(req.body.orderId);


  if (access === 'customer') {
    knex('users')
      .where('access', 'admin')
      .orWhere('access', 'employee')
      .then((users) => {

        console.log('Uncomment nodemailer in ROUTE notify.js');

        // for (let i = 0; i < users.length; i++) {
        //   var transporter = nodemailer.createTransport(smtpTransport({
        //     service: 'Gmail',
        //     auth: {
        //       user: process.env.GMAIL_USER,
        //       pass: process.env.GMAIL_PASSWORD
        //     }
        //   }));
        //
        //   let mailOptions = {
        //      from: process.env.GMAIL_USER,
        //      to: process.env.GMAIL_USER,
        //      subject: 'Laundry Service - New Order',
        //      text: `A new order has been submitted. Order #: ${orderId}`
        //   };
        //
        //   transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //       console.log(error);
        //       return;
        //     }
        //
        //     console.log('Message %s sent: %s', info.messageId, info.response);
        //     transporter.close();
        //   });
        // }

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

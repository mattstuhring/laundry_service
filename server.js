'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ silent: true });
}

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const ev = require('express-validation');
const morgan = require('morgan');

// Middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');

// Routes go here
const users = require('./routes/users');
const token = require('./routes/token');
const authCustomer = require('./routes/authCustomer');
const authEmployee = require('./routes/authEmployee');
const authAdmin = require('./routes/authAdmin');
const forgotPassword = require('./routes/forgotPassword');
const resetPassword = require('./routes/resetPassword');

const app = express();

app.disable('x-powered-by');

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}

// serve static assets normally
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json());
app.use(cookieParser());

// app.use(cookieSession({
//   name: 'fused_glass_dev',
//   secret: process.env.SESSION_SECRET
// }));

app.use('/api', users);
app.use('/api', token);
app.use('/api', authCustomer);
app.use('/api', authEmployee);
app.use('/api', authAdmin);
app.use('/api', forgotPassword);
app.use('/api', resetPassword);

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// error catch all 400
app.use((_req, res, _next) => {
  res.sendStatus(404);
});

// server error handler
app.use((err, _req, res, _next) => {
  if (err instanceof ev.ValidationError) {
    return res.status(err.status).json(err);
  }

  if (err.status) {
    return res
      .status(err.status)
      .set('Content-Type', 'plain/text')
      .send(err.message);
  }

  console.error(err);
  res.sendStatus(500);
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Listening on PORT', PORT);
  }
});

module.exports = app;

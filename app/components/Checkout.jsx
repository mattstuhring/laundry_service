import React from 'react'
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import StripeCheckout from 'react-stripe-checkout';
import STRIPE_PUBLISHABLE from './constants/stripe';

const CURRENCY = 'USD';

const successPayment = data => {
  alert('Payment Successful');
  browserHistory.push('/success');
};

const errorPayment = data => {
  alert('Payment Error');
  browserHistory.push('/failure');
};

const onToken = (amount, description) => token =>
  axios.post('/api/charge',
    {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: amount
    })
    .then(successPayment)
    .catch(errorPayment);

const Checkout = ({ name, description, amount }) =>
  <StripeCheckout
    name={name}
    description={description}
    amount={amount}
    token={onToken(amount, description)}
    currency={CURRENCY}
    stripeKey={STRIPE_PUBLISHABLE}
  />

export default Checkout;

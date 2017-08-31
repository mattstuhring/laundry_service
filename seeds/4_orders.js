'use strict';

exports.seed = function(knex) {
  return knex('orders').del()
    .then(() => knex('orders').insert([
      {
        id: 1,
        address: '22309 Old Poplar Way, Brier, WA 98036',
        status: 'Complete',
        step: 'Drop-off',
        instructions: 'Thanks!',
        customer_id: 3,
        employee_id: 2,
        payment_id: 1,
        setting_id: 1,
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 2,
        address: '22309 Old Poplar Way, Brier, WA 98036',
        status: 'Queue',
        step: 'Pick-up',
        instructions: 'Text me when you get here.',
        customer_id: 3,
        employee_id: 2,
        payment_id: 2,
        setting_id: 2,
        created_at: new Date('2017-08-16 12:12:16 UTC'),
        updated_at: new Date('2017-08-16 12:12:16 UTC')
      },
      {
        id: 3,
        address: '22309 Old Poplar Way, Brier, WA 98036',
        status: 'Active',
        step: 'Cleaning',
        instructions: 'No bleach.',
        customer_id: 3,
        employee_id: 2,
        payment_id: 3,
        setting_id: 3,
        created_at: new Date('2017-08-19 12:12:16 UTC'),
        updated_at: new Date('2017-08-19 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));"
      )
    );
};

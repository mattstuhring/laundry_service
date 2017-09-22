'use strict';

exports.seed = function(knex) {
  return knex('orders').del()
    .then(() => knex('orders').insert([
      {
        id: 1,
        address: '22309 Old Poplar Way, Brier, WA 98036',
        status: 'Queue',
        step: 'Queue',
        instructions: 'Thanks!',
        time: '08:00 AM',
        customer_id: 3,
        employee_id: null,
        payment_id: 1,
        setting_id: 1,
        task_id: 1,
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 2,
        address: '22309 Old Poplar Way, Brier, WA 98036',
        status: 'Queue',
        step: 'Queue',
        instructions: 'Text me when you get here.',
        time: '04:00 PM',
        customer_id: 3,
        employee_id: null,
        payment_id: 2,
        setting_id: 2,
        task_id: 2,
        created_at: new Date('2017-08-16 12:12:16 UTC'),
        updated_at: new Date('2017-08-16 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));"
      )
    );
};

// ,
// {
//   id: 3,
//   address: '22309 Old Poplar Way, Brier, WA 98036',
//   status: 'Active',
//   step: 'Cleaning',
//   instructions: 'Use dryer sheet.',
//   customer_id: 3,
//   employee_id: 2,
//   payment_id: 3,
//   setting_id: 3,
//   task_id: 3,
//   created_at: new Date('2017-08-19 12:12:16 UTC'),
//   updated_at: new Date('2017-08-19 12:12:16 UTC')
// },
// {
//   id: 4,
//   address: '22309 Old Poplar Way, Brier, WA 98036',
//   status: 'Active',
//   step: 'Pick-up',
//   instructions: 'I love this app!',
//   customer_id: 3,
//   employee_id: 2,
//   payment_id: 4,
//   setting_id: 4,
//   task_id: 4,
//   created_at: new Date('2017-08-20 12:12:16 UTC'),
//   updated_at: new Date('2017-08-20 12:12:16 UTC')
// },
// {
//   id: 5,
//   address: '22309 Old Poplar Way, Brier, WA 98036',
//   status: 'Queue',
//   step: 'Queue',
//   instructions: 'I am never doing laundry again.',
//   customer_id: 3,
//   employee_id: 2,
//   payment_id: 5,
//   setting_id: 5,
//   task_id: 5,
//   created_at: new Date('2017-08-21 12:12:16 UTC'),
//   updated_at: new Date('2017-08-21 12:12:16 UTC')
// }

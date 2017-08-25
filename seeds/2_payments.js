'use strict';

exports.seed = function(knex) {
  return knex('payments').del()
    .then(() => knex('payments').insert([
      {
        id: 1,
        type: 'Venmo',
        amount: 10.00,
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 2,
        type: 'Cash',
        amount: 10.00,
        created_at: new Date('2017-08-17 12:12:16 UTC'),
        updated_at: new Date('2017-08-17 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('payments_id_seq', (SELECT MAX(id) FROM payments));"
      )
    );
};

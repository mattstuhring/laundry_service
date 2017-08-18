'use strict';

exports.seed = function(knex) {
  return knex('customers').del()
    .then(() => knex('customers').insert([
      {
        id: 1,
        first_name: 'Matt',
        last_name: 'Stuhring',
        address: '22309 Old Poplar Way, Brier, WA 98036',
        email: 'customer@test.com',
        hashed_password: '$2a$12$fRciz5IUz3Z4L1yf6w88POir67BixNJsUyJskX5U9ttZGqqUSUlZy',
        access: 'customer',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));"
      )
    );
};

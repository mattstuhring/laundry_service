'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => knex('users').insert([
      {
        id: 1,
        first_name: 'Admin',
        last_name: '',
        address: '22309 Old Poplar Way, Brier, WA 98036',
        email: 'admin@test.com',
        phone_number: '4257651612',
        hashed_password: '$2a$12$fRciz5IUz3Z4L1yf6w88POir67BixNJsUyJskX5U9ttZGqqUSUlZy',
        access: 'admin',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 2,
        first_name: 'Employee',
        last_name: '',
        address: '22309 Old Poplar Way, Brier, WA 98036',
        email: 'employee@test.com',
        phone_number: '4257651612',
        hashed_password: '$2a$12$fRciz5IUz3Z4L1yf6w88POir67BixNJsUyJskX5U9ttZGqqUSUlZy',
        access: 'employee',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 3,
        first_name: 'Matt',
        last_name: 'Stuhring',
        address: '22309 Old Poplar Way, Brier, WA 98036',
        email: 'customer@test.com',
        phone_number: '4257651612',
        hashed_password: '$2a$12$fRciz5IUz3Z4L1yf6w88POir67BixNJsUyJskX5U9ttZGqqUSUlZy',
        access: 'customer',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      )
    );
};

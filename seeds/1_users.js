'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => knex('users').insert([
      {
        id: 1,
        first_name: 'Admin',
        last_name: 'test',
        address: 'test address',
        email: 'admin@test.com',
        phone_number: '123-456-7890',
        // hashed_password: '$2a$12$fRciz5IUz3Z4L1yf6w88POir67BixNJsUyJskX5U9ttZGqqUSUlZy',
        hashed_password: '$2a$12$isAaHeeoxylS2IwW.CuoruDfpk2K1akWsqDpTn6otktvnO3Y1JBrO',
        access: 'admin',
        reset_password_token: '',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 2,
        first_name: 'Employee',
        last_name: 'test',
        address: 'test address',
        email: 'employee@test.com',
        phone_number: '123-456-7890',
        hashed_password: '$2a$12$isAaHeeoxylS2IwW.CuoruDfpk2K1akWsqDpTn6otktvnO3Y1JBrO',
        access: 'employee',
        reset_password_token: '',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 3,
        first_name: 'Customer',
        last_name: 'test',
        address: 'test address',
        email: 'customer@test.com',
        phone_number: '123-456-7890',
        hashed_password: '$2a$12$isAaHeeoxylS2IwW.CuoruDfpk2K1akWsqDpTn6otktvnO3Y1JBrO',
        access: 'customer',
        reset_password_token: '',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      )
    );
};

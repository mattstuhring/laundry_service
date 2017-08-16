'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => knex('users').insert([
      {
        id: 1,
        first_name: 'Matt',
        last_name: 'Stuhring',
        email: 'matt@test.com',
        hashed_password: '$2a$12$fRciz5IUz3Z4L1yf6w88POir67BixNJsUyJskX5U9ttZGqqUSUlZy',
        phone_number: '+14257651612',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      )
    );
};

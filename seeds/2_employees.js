'use strict';

exports.seed = function(knex) {
  return knex('employees').del()
    .then(() => knex('employees').insert([
      {
        id: 1,
        email: 'employee@test.com',
        hashed_password: '$2a$12$fRciz5IUz3Z4L1yf6w88POir67BixNJsUyJskX5U9ttZGqqUSUlZy',
        access: 'employee',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));"
      )
    );
};

'use strict';

exports.seed = function(knex) {
  return knex('admins').del()
    .then(() => knex('admins').insert([
      {
        id: 1,
        email: 'admin@test.com',
        hashed_password: '$2a$12$fRciz5IUz3Z4L1yf6w88POir67BixNJsUyJskX5U9ttZGqqUSUlZy',
        access: 'admin',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('admins_id_seq', (SELECT MAX(id) FROM admins));"
      )
    );
};

'use strict';

exports.seed = function(knex) {
  return knex('settings').del()
    .then(() => knex('settings').insert([
      {
        id: 1,
        amount: 1,
        clean: true,
        fold: true,
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 2,
        amount: 2,
        clean: true,
        fold: false,
        created_at: new Date('2017-08-16 12:12:16 UTC'),
        updated_at: new Date('2017-08-16 12:12:16 UTC')
      },
      {
        id: 3,
        amount: 3,
        clean: true,
        fold: true,
        created_at: new Date('2017-08-19 12:12:16 UTC'),
        updated_at: new Date('2017-08-19 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('settings_id_seq', (SELECT MAX(id) FROM settings));"
      )
    );
};

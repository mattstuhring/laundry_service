'use strict';

exports.seed = function(knex) {
  return knex('pickups').del()
    .then(() => knex('pickups').insert([
      {
        id: 1,
        date: '2017-08-15',
        time: '04:30 PM',
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      },
      {
        id: 2,
        date: '2017-08-16',
        time: '08:00 AM',
        created_at: new Date('2017-08-16 12:12:16 UTC'),
        updated_at: new Date('2017-08-16 12:12:16 UTC')
      }
    ])
    )
    .then(() => knex.raw(
        "SELECT setval('pickups_id_seq', (SELECT MAX(id) FROM pickups));"
      )
    );
};

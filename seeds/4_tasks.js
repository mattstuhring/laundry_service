'use strict';

exports.seed = function(knex) {
  return knex('tasks').del()
    .then(() => knex('tasks').insert([
      {
        id: 1,
        pickup: 2,
        wash_dry: 2,
        dropoff: 2,
        created_at: new Date('2017-08-15 12:12:16 UTC'),
        updated_at: new Date('2017-08-15 12:12:16 UTC')
      }])
    )
    .then(() => knex.raw(
        "SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));"
      )
    );
};

// ,
// {
//   id: 2,
//   pickup: 2,
//   wash_dry: 2,
//   dropoff: 2,
//   created_at: new Date('2017-08-16 12:12:16 UTC'),
//   updated_at: new Date('2017-08-16 12:12:16 UTC')
// },
// {
//   id: 3,
//   pickup: 2,
//   wash_dry: 2,
//   dropoff: null,
//   created_at: new Date('2017-08-19 12:12:16 UTC'),
//   updated_at: new Date('2017-08-19 12:12:16 UTC')
// },
// {
//   id: 4,
//   pickup: 2,
//   wash_dry: null,
//   dropoff: null,
//   created_at: new Date('2017-08-20 12:12:16 UTC'),
//   updated_at: new Date('2017-08-20 12:12:16 UTC')
// },
// {
//   id: 5,
//   pickup: null,
//   wash_dry: null,
//   dropoff: null,
//   created_at: new Date('2017-08-21 12:12:16 UTC'),
//   updated_at: new Date('2017-08-21 12:12:16 UTC')
// }

'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('pickups', (table) => {
    table.increments('id');
    table.string('date').defaultTo('');
    table.string('time').defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('pickups');
};

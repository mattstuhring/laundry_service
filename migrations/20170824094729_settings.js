'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('settings', (table) => {
    table.increments('id');
    table.integer('amount').defaultTo(null);
    table.boolean('clean').defaultTo(false);
    table.boolean('fold').defaultTo(false);
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('settings');
};

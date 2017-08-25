'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('payments', (table) => {
    table.increments('id');
    table.string('type').defaultTo('');
    table.decimal('amount').defaultTo(null);
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('payments');
};

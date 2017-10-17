'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('payments', (table) => {
    table.increments('id');
    table.boolean('received').defaultTo(false);
    table.string('type').defaultTo('');
    table.decimal('total').defaultTo(null);
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('payments');
};

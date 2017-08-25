'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('orders', (table) => {
    table.increments('id');
    table.string('address').defaultTo('');
    table.string('status').defaultTo('');
    table.string('instructions').defaultTo('');
    table.integer('customer_id')
      .unsigned()
      .references('id')
      .inTable('users');
    table.integer('employee_id')
      .unsigned()
      .references('id')
      .inTable('users');
    table.integer('payment_id')
      .unsigned()
      .references('id')
      .inTable('payments');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};

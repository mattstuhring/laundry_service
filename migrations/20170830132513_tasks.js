'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id');
    table.integer('pickup').defaultTo(null);
    table.integer('wash_dry').defaultTo(null);
    table.integer('dropoff').defaultTo(null);
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};

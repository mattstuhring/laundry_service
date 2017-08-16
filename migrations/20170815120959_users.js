'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('first_name').defaultTo('');
    table.string('last_name').defaultTo('');
    table.string('email').unique().notNullable().defaultTo('');
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.string('phone_number').defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};

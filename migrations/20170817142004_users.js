'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('first_name').defaultTo('');
    table.string('last_name').defaultTo('');
    table.string('address').defaultTo('');
    table.string('email').unique().notNullable().defaultTo('');
    table.string('phone_number').defaultTo('');
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.string('access').notNullable().defaultTo('');
    table.string('reset_password_token').defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};

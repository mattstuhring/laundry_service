'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('admins', (table) => {
    table.increments('id');
    table.string('email').defaultTo('');
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.string('access').notNullable().defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('admins');
};

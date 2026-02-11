/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};

export const up = async (knex) => {
  await knex.schema.createTable('tasks_labels', (table) => {
    table.increments('id').primary();

    table
      .integer('taskId')
      .references('id')
      .inTable('tasks')
      .onDelete('CASCADE');

    table
      .integer('labelId')
      .references('id')
      .inTable('labels')
      .onDelete('CASCADE');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('tasks_labels');
};


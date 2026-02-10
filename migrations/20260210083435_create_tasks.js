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

exports.up = async (knex) => {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();

    table.string('name').notNullable();
    table.text('description');

    // статус
    table
      .integer('statusId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('task_statuses')
      .onDelete('RESTRICT');

    // создатель (обязателен)
    table
      .integer('creatorId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    // исполнитель (необязателен)
    table
      .integer('executorId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.timestamps(true, true);
  });
};

exports.down = (knex) => knex.schema.dropTable('tasks');

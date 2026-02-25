/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => (
  knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  })
);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => knex.schema.dropTable('labels');

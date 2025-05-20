import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('doctors', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('crm').notNullable().unique();
    table.string('phone', 15);
    table.string('email').unique();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('doctors');
} 
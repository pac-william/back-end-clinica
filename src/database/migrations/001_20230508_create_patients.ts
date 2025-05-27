import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('patients', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('cpf', 11).notNullable().unique();
    table.date('birth_date').notNullable();
    table.string('phone', 15);
    table.string('email').unique();
    table.string('address');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('patients');
} 
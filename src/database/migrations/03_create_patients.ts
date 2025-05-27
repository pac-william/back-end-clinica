import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('patients', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('cpf', 11).notNullable().unique();
    table.date('birth_date').notNullable();
    table.string('phone', 15);
    table.string('email').unique();
    table.string('address');
    table.integer('user_id').unsigned().unique();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('patients');
} 
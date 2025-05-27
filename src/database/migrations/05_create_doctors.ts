import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('doctors', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('crm').notNullable().unique();
    table.string('phone', 15);
    table.string('email').unique();
    table.integer('user_id').unsigned().unique();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('doctors');
} 
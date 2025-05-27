import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('secretary_doctor', (table) => {
    table.increments('id').primary();
    table.integer('secretary_id').unsigned().notNullable();
    table.integer('doctor_id').unsigned().notNullable();
    table.foreign('secretary_id').references('id').inTable('secretary').onDelete('CASCADE');
    table.foreign('doctor_id').references('id').inTable('doctors').onDelete('CASCADE');
    table.unique(['secretary_id', 'doctor_id']);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('secretary_doctor');
} 
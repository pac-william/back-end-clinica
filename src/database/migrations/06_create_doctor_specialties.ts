import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('doctor_specialties', (table) => {
    table.increments('id').primary();
    table.integer('doctor_id').unsigned().notNullable();
    table.integer('specialty_id').unsigned().notNullable();
    table.foreign('doctor_id').references('id').inTable('doctors').onDelete('CASCADE');
    table.foreign('specialty_id').references('id').inTable('specialty').onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['doctor_id', 'specialty_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('doctor_specialties');
} 
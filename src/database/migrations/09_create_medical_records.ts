import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('medical_records', (table) => {
    table.increments('id').primary();
    table.integer('patient_id').unsigned().notNullable();
    table.integer('doctor_id').unsigned().notNullable();
    table.text('description').notNullable();
    table.datetime('record_date').notNullable();
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    table.foreign('doctor_id').references('id').inTable('doctors').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('medical_records');
} 
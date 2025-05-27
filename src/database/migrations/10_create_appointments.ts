import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('appointments', (table) => {
    table.increments('id').primary();
    table.integer('patient_id').unsigned().notNullable();
    table.integer('doctor_id').unsigned().notNullable();
    table.datetime('appointment_date').notNullable();
    table.string('status').defaultTo('agendada');
    table.text('notes');
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    table.foreign('doctor_id').references('id').inTable('doctors').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('appointments');
} 
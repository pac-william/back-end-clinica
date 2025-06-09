import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('exams', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.decimal('price', 10, 2).notNullable();
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);
  });

  // Tabela associativa entre consultas e exames
  await knex.schema.createTable('appointment_exams', (table) => {
    table.increments('id').primary();
    table.integer('appointment_id').unsigned().notNullable();
    table.integer('exam_id').unsigned().notNullable();
    table.date('scheduled_date').nullable();
    table.date('result_date').nullable();
    table.enum('status', ['REQUESTED', 'SCHEDULED', 'COMPLETED', 'CANCELED']).defaultTo('REQUESTED');
    table.text('result').nullable();
    table.text('notes').nullable();
    table.foreign('appointment_id').references('id').inTable('appointments').onDelete('CASCADE');
    table.foreign('exam_id').references('id').inTable('exams').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('appointment_exams');
  await knex.schema.dropTableIfExists('exams');
} 
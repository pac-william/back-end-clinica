import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Cria a tabela de relacionamento entre pacientes e convênios
  await knex.schema.createTable('patient_insurances', (table) => {
    table.increments('id').primary();
    table.integer('patient_id').unsigned().notNullable();
    table.integer('insurance_id').unsigned().notNullable();
    table.string('insurance_number').nullable();
    table.date('valid_until').nullable();
    table.boolean('active').defaultTo(true);
    table.foreign('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    table.foreign('insurance_id').references('id').inTable('insurances').onDelete('CASCADE');
    table.timestamps(true, true);
    
    // Índice composto para evitar duplicatas
    table.unique(['patient_id', 'insurance_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('patient_insurances');
} 
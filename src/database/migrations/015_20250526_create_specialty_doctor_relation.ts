import { Knex } from 'knex';

export async function up(knex: Knex) {
    await knex.schema.createTable('specialty_doctor', (table) => {
        table.increments('id').primary();
        table.integer('specialty_id').references('id').inTable('specialties');
        table.integer('doctor_id').references('id').inTable('doctors');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('specialty_doctor');
}
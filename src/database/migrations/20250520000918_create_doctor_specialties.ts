import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('doctor_specialties', (table) => {
        table.increments('id').primary();
        table.integer('doctor_id').notNullable().references('id').inTable('doctors').onDelete('CASCADE');
        table.integer('specialty_id').notNullable().references('id').inTable('specialty').onDelete('CASCADE');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('doctor_specialties');
} 
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('patient_record', (table) => {
        table.date('consultation_date').notNullable().defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('patient_record', (table) => {
        table.dropColumn('consultation_date');
    });       
}


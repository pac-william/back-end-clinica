import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.renameTable('patient_record', 'medical_record');
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.renameTable('medical_record', 'patient_record');
}


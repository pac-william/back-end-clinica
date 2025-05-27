import { Knex } from 'knex';

export async function up(knex: Knex) {
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('role');
    });
    await knex.schema.alterTable('users', (table) => {
        table.enum('role', ['USER', 'ADMIN', 'MASTER']).defaultTo('USER');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('role');
    });
    await knex.schema.alterTable('users', (table) => {
        table.enum('role', ['DOCTOR', 'SECRETARY', 'PATIENT']).notNullable();
    });
}
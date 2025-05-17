import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('users', function(table) {
        table.integer('role_id').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('users', function(table) {
        table.dropColumn('role_id');
    });
}


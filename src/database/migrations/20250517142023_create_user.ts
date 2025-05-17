import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('login').notNullable();
    table.string('senha').notNullable();

    table.enu('role', ['DOCTOR', 'SECRETARY', 'PATIENT'], {
      useNative: true,
      enumName: 'user_role'
    }).notNullable();
    
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users').raw('DROP TYPE IF EXISTS user_role');
}


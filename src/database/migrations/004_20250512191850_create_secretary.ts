import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('secretarys', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('department').nullable();
      table.string('phone').nullable();
      table.string('cpf').nullable().unique();
      table.timestamps(true, true);
    });
  }
  
  export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('secretarys');
  }
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('secretarys', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('department').notNullable();
      table.string('phone').notNullable();
      table.string('cpf').notNullable().unique();
      table.timestamps(true, true); 
    });
  }
  
  export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('secretary');
  }
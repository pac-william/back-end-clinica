import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Adiciona o campo active na tabela patients
  await knex.schema.alterTable('patients', (table) => {
    table.boolean('active').defaultTo(true);
  });

  // Adiciona o campo active na tabela secretaries
  await knex.schema.alterTable('secretaries', (table) => {
    table.boolean('active').defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove o campo active da tabela patients
  await knex.schema.alterTable('patients', (table) => {
    table.dropColumn('active');
  });

  // Remove o campo active da tabela secretaries
  await knex.schema.alterTable('secretaries', (table) => {
    table.dropColumn('active');
  });
} 
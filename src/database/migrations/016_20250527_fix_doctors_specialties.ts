import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('doctors', (table) => {
    // Remove a coluna specialties_ids, já que temos a tabela specialty_doctor para esse relacionamento
    table.dropColumn('specialties_ids');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('doctors', (table) => {
    // Restaura a coluna specialties_ids em caso de rollback
    table.specificType('specialties_ids', 'INTEGER[]').notNullable().defaultTo('{}');
  });
} 
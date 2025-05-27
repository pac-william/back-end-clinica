import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    // Remove a coluna role_id que não está sendo utilizada
    table.dropColumn('role_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    // Restaura a coluna role_id em caso de rollback
    table.integer('role_id').notNullable().defaultTo(0);
  });
} 
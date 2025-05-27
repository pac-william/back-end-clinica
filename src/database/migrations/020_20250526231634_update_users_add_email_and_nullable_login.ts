import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Verifica se as colunas existem antes de tentar dropá-las ou adicioná-las
  const hasLogin = await knex.schema.hasColumn('users', 'login');
  const hasSenha = await knex.schema.hasColumn('users', 'senha');
  const hasEmail = await knex.schema.hasColumn('users', 'email');
  const hasPassword = await knex.schema.hasColumn('users', 'password');

  await knex.schema.alterTable('users', (table) => {
    if (hasLogin) {
      table.dropColumn('login');
    }
    
    if (hasSenha) {
      table.dropColumn('senha');
    }
    
    if (!hasEmail) {
      table.string('email').notNullable();
    }
    
    if (!hasPassword) {
      table.string('password').notNullable();
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  // Verifica se as colunas existem antes de tentar dropá-las ou adicioná-las
  const hasEmail = await knex.schema.hasColumn('users', 'email');
  const hasLogin = await knex.schema.hasColumn('users', 'login');

  await knex.schema.alterTable('users', (table) => {
    if (hasEmail) {
      table.dropColumn('email');
    }
    
    if (!hasLogin) {
      table.string('login').notNullable();
    }
  });
}

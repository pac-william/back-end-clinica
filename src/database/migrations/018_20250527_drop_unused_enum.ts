import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Remove o enum user_role que não está sendo utilizado
  return knex.raw('DROP TYPE IF EXISTS public.user_role;');
}

export async function down(knex: Knex): Promise<void> {
  // Recria o enum user_role em caso de rollback
  return knex.raw(`
    CREATE TYPE public.user_role AS ENUM (
      'DOCTOR',
      'SECRETARY',
      'PATIENT'
    );
  `);
} 
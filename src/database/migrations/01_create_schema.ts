import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS ${process.env.DB_SCHEMA || 'clinic_db'}`);
  await knex.raw(`SET search_path TO ${process.env.DB_SCHEMA || 'clinic_db'}`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO public`);
} 
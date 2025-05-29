import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('specialty', 'specialties');
  await knex.schema.renameTable('secretary', 'secretaries');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('specialties', 'specialty');
  await knex.schema.renameTable('secretaries', 'secretary');
}


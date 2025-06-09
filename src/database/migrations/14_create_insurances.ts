import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('insurances', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('plan_type').nullable();
    table.decimal('discount_percentage', 5, 2).defaultTo(0);
    table.string('contact_phone').nullable();
    table.string('contact_email').nullable();
    table.string('registration_number').nullable();
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);
  });

  // Adiciona a restrição de chave estrangeira na tabela payments
  await knex.schema.alterTable('payments', (table) => {
    table.foreign('insurance_id').references('id').inTable('insurances').onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove a restrição de chave estrangeira da tabela payments
  await knex.schema.alterTable('payments', (table) => {
    table.dropForeign(['insurance_id']);
  });

  await knex.schema.dropTableIfExists('insurances');
} 
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.integer('appointment_id').unsigned().notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.enum('status', ['PENDING', 'PAID', 'CANCELED', 'REFUNDED']).defaultTo('PENDING');
    table.enum('payment_method', ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BANK_SLIP', 'INSURANCE']).notNullable();
    table.integer('insurance_id').unsigned().nullable();
    table.string('transaction_id').nullable();
    table.date('payment_date').nullable();
    table.text('notes').nullable();
    table.foreign('appointment_id').references('id').inTable('appointments').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('payments');
} 
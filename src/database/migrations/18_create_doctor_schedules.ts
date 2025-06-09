import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Cria a tabela de disponibilidade dos médicos
  await knex.schema.createTable('doctor_schedules', (table) => {
    table.increments('id').primary();
    table.integer('doctor_id').unsigned().notNullable();
    table.enum('day_of_week', ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']).notNullable();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.integer('appointment_duration').defaultTo(30).comment('Duração da consulta em minutos');
    table.boolean('active').defaultTo(true);
    table.foreign('doctor_id').references('id').inTable('doctors').onDelete('CASCADE');
    table.timestamps(true, true);
    
    // Índice para otimizar consultas de agendamento
    table.index(['doctor_id', 'day_of_week', 'active']);
  });

  // Cria a tabela para datas de indisponibilidade dos médicos
  await knex.schema.createTable('doctor_unavailable_dates', (table) => {
    table.increments('id').primary();
    table.integer('doctor_id').unsigned().notNullable();
    table.date('date').notNullable();
    table.time('start_time').nullable();
    table.time('end_time').nullable();
    table.text('reason').nullable();
    table.foreign('doctor_id').references('id').inTable('doctors').onDelete('CASCADE');
    table.timestamps(true, true);
    
    // Índice para otimizar consultas de agendamento
    table.index(['doctor_id', 'date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('doctor_unavailable_dates');
  await knex.schema.dropTableIfExists('doctor_schedules');
} 
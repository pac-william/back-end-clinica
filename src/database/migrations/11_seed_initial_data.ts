import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex('specialty').insert([
    { name: 'Cardiologia' },
    { name: 'Dermatologia' },
    { name: 'Endocrinologia' },
    { name: 'Ginecologia' },
    { name: 'Neurologia' },
    { name: 'Oftalmologia' },
    { name: 'Ortopedia' },
    { name: 'Pediatria' },
    { name: 'Psiquiatria' },
    { name: 'Urologia' }
  ]);
  
  await knex('users').insert({
    email: 'admin@clinica.com',
    password: '$2b$10$X7GjSSK8Uzw3Xa0Uw/Vl4eSZ86GgEQXJJgRUk3fQdKMpfvEEHzg.m',
    role: 'ADMIN'
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('specialty').del();
  await knex('users').where({ email: 'admin@clinica.com' }).del();
} 
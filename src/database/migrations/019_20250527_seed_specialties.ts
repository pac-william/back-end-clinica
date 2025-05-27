import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Adiciona as especialidades que estão sendo referenciadas na tabela doctors
  await knex('specialties').insert([
    { id: 6, name: 'Clínica Geral' },
    { id: 7, name: 'Dermatologia' },
    { id: 8, name: 'Ortopedia' }
  ]);

  // Adiciona relacionamentos na tabela specialty_doctor
  await knex('specialty_doctor').insert([
    { specialty_id: 6, doctor_id: 9 },
    { specialty_id: 7, doctor_id: 10 },
    { specialty_id: 8, doctor_id: 11 }
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // Remove os relacionamentos adicionados
  await knex('specialty_doctor')
    .whereIn('specialty_id', [6, 7, 8])
    .del();

  // Remove as especialidades adicionadas
  await knex('specialties')
    .whereIn('id', [6, 7, 8])
    .del();
} 
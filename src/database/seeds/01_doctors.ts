import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Primeiro, vamos criar algumas especialidades
  await knex('specialty').del();
  const specialties = await knex('specialty').insert([
    { name: 'Cardiologia' },
    { name: 'Dermatologia' },
    { name: 'Ortopedia' }
  ]).returning('*');

  // Agora vamos criar os médicos
  await knex('doctors').del();
  const doctors = await knex('doctors').insert([
    {
      name: 'Dr. João Silva',
      crm: '123456SP',
      phone: '(11) 99999-8888',
      email: 'joao.silva@clinica.com',
    },
    {
      name: 'Dra. Maria Souza',
      crm: '654321SP',
      phone: '(11) 99999-7777',
      email: 'maria.souza@clinica.com',
    },
    {
      name: 'Dr. Carlos Oliveira',
      crm: '789012SP',
      phone: '(11) 99999-6666',
      email: 'carlos.oliveira@clinica.com',
    },
  ]).returning('*');

  // Agora vamos criar os relacionamentos entre médicos e especialidades
  await knex('doctor_specialties').del();
  await knex('doctor_specialties').insert([
    { doctor_id: doctors[0].id, specialty_id: specialties[0].id }, // João Silva - Cardiologia
    { doctor_id: doctors[1].id, specialty_id: specialties[1].id }, // Maria Souza - Dermatologia
    { doctor_id: doctors[2].id, specialty_id: specialties[2].id }, // Carlos Oliveira - Ortopedia
  ]);
}
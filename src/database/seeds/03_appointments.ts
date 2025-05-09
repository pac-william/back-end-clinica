import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Limpa a tabela de consultas
    await knex('appointments').del();

    // Obtém IDs de pacientes e médicos existentes
    const patients = await knex('patients').select('id');
    const doctors = await knex('doctors').select('id');

    if (patients.length === 0 || doctors.length === 0) {
        console.log('É necessário ter pacientes e médicos cadastrados para criar consultas');
        return;
    }

    // Insere dados iniciais
    await knex('appointments').insert([
        {
            patient_id: patients[0].id,
            doctor_id: doctors[0].id,
            appointment_date: new Date('2023-10-15T10:00:00'),
            status: 'agendada',
            notes: 'Consulta de rotina'
        },
        {
            patient_id: patients[1].id,
            doctor_id: doctors[1].id,
            appointment_date: new Date('2023-10-16T14:30:00'),
            status: 'agendada',
            notes: 'Avaliação de pele'
        },
        {
            patient_id: patients[2].id,
            doctor_id: doctors[2].id,
            appointment_date: new Date('2023-10-17T09:15:00'),
            status: 'agendada',
            notes: 'Dor no joelho'
        }
    ]);
} 
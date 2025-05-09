import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Truncate para limpar a tabela
    await knex('doctors').del();

    // Inserir dados iniciais
    await knex('doctors').insert([
        {
            name: 'Dr. João Silva',
            crm: '123456SP',
            specialty: 'Cardiologia',
            phone: '(11) 99999-8888',
            email: 'joao.silva@clinica.com'
        },
        {
            name: 'Dra. Maria Souza',
            crm: '654321SP',
            specialty: 'Dermatologia',
            phone: '(11) 99999-7777',
            email: 'maria.souza@clinica.com'
        },
        {
            name: 'Dr. Carlos Oliveira',
            crm: '789012SP',
            specialty: 'Ortopedia',
            phone: '(11) 99999-6666',
            email: 'carlos.oliveira@clinica.com'
        }
    ]);
} 
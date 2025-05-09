import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Limpa a tabela de pacientes
    await knex('patients').del();

    // Insere dados iniciais
    await knex('patients').insert([
        {
            name: 'Ana Santos',
            cpf: '12345678901',
            birth_date: '1985-03-15',
            phone: '(11) 98765-4321',
            email: 'ana.santos@email.com',
            address: 'Rua das Flores, 123'
        },
        {
            name: 'Pedro Oliveira',
            cpf: '98765432109',
            birth_date: '1990-07-22',
            phone: '(11) 91234-5678',
            email: 'pedro.oliveira@email.com',
            address: 'Av. Paulista, 1000'
        },
        {
            name: 'Mariana Costa',
            cpf: '45678912345',
            birth_date: '1978-11-05',
            phone: '(11) 92222-3333',
            email: 'mariana.costa@email.com',
            address: 'Rua Augusta, 500'
        }
    ]);
} 
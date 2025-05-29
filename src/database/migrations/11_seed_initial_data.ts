import bcrypt from 'bcrypt';
import type { Knex } from "knex";

const masterEmail = process.env.MASTER_EMAIL;
const masterPassword = process.env.MASTER_PASSWORD;

export async function up(knex: Knex): Promise<void> {

  if (!masterPassword) {
    throw new Error('MASTER_PASSWORD deve ser definido no arquivo .env');
  }

  const masterPasswordHash = await bcrypt.hash(masterPassword, 10);

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
    email: masterEmail,
    password: masterPasswordHash,
    role: 'MASTER'
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('specialty').del();
  await knex('users').where({ email: masterEmail }).del();
} 
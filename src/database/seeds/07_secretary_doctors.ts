import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("secretary_doctor").del();

  // Obter IDs dos secretários
  const secretaries = await knex("secretaries").select("id", "name");
  
  // Obter IDs dos médicos
  const doctors = await knex("doctors").select("id", "name");

  // Encontrar IDs específicos
  const emilyBrown = secretaries.find(s => s.name === "Emily Brown")?.id;
  const davidWilson = secretaries.find(s => s.name === "David Wilson")?.id;

  const drMichael = doctors.find(d => d.name === "Dr. Michael Johnson")?.id;
  const drSarah = doctors.find(d => d.name === "Dr. Sarah Williams")?.id;
  const drRobert = doctors.find(d => d.name === "Dr. Robert Davis")?.id;
  const drJennifer = doctors.find(d => d.name === "Dr. Jennifer Miller")?.id;

  // Insere os registros iniciais
  await knex("secretary_doctor").insert([
    { secretary_id: emilyBrown, doctor_id: drMichael },
    { secretary_id: emilyBrown, doctor_id: drSarah },
    { secretary_id: davidWilson, doctor_id: drRobert },
    { secretary_id: davidWilson, doctor_id: drJennifer }
  ]);
} 
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("doctor_specialties").del();

  // Obter IDs dos médicos
  const doctors = await knex("doctors").select("id", "name");
  
  // Obter IDs das especialidades
  const specialties = await knex("specialties").select("id", "name");

  // Encontrar IDs específicos
  const drMichael = doctors.find(d => d.name === "Dr. Michael Johnson")?.id;
  const drSarah = doctors.find(d => d.name === "Dr. Sarah Williams")?.id;
  const drRobert = doctors.find(d => d.name === "Dr. Robert Davis")?.id;
  const drJennifer = doctors.find(d => d.name === "Dr. Jennifer Miller")?.id;

  const generalPractice = specialties.find(s => s.name === "General Practice")?.id;
  const cardiology = specialties.find(s => s.name === "Cardiology")?.id;
  const dermatology = specialties.find(s => s.name === "Dermatology")?.id;
  const gynecology = specialties.find(s => s.name === "Gynecology")?.id;
  const pediatrics = specialties.find(s => s.name === "Pediatrics")?.id;
  const neurology = specialties.find(s => s.name === "Neurology")?.id;

  // Insere os registros iniciais
  await knex("doctor_specialties").insert([
    { doctor_id: drMichael, specialty_id: generalPractice },
    { doctor_id: drMichael, specialty_id: cardiology },
    
    { doctor_id: drSarah, specialty_id: dermatology },
    { doctor_id: drSarah, specialty_id: gynecology },
    
    { doctor_id: drRobert, specialty_id: pediatrics },
    { doctor_id: drRobert, specialty_id: generalPractice },
    
    { doctor_id: drJennifer, specialty_id: neurology },
    { doctor_id: drJennifer, specialty_id: cardiology }
  ]);
} 
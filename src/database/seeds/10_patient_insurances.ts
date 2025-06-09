import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("patient_insurances").del();

  // Obter IDs dos pacientes
  const patients = await knex("patients").select("id", "name");
  
  // Obter IDs dos convênios
  const insurances = await knex("insurances").select("id", "name");

  // Encontrar IDs específicos
  const johnDoe = patients.find(p => p.name === "John Doe")?.id;
  const janeDoe = patients.find(p => p.name === "Jane Doe")?.id;
  const aliceJohnson = patients.find(p => p.name === "Alice Johnson")?.id;
  const bobSmith = patients.find(p => p.name === "Bob Smith")?.id;

  const medPlus = insurances.find(i => i.name === "MedPlus")?.id;
  const healthCare = insurances.find(i => i.name === "HealthCare")?.id;
  const lifeWell = insurances.find(i => i.name === "LifeWell")?.id;
  const wellMed = insurances.find(i => i.name === "WellMed")?.id;

  // Insere os registros iniciais
  await knex("patient_insurances").insert([
    {
      patient_id: johnDoe,
      insurance_id: medPlus,
      insurance_number: "MP12345",
      valid_until: new Date("2024-12-31"),
      active: true
    },
    {
      patient_id: janeDoe,
      insurance_id: healthCare,
      insurance_number: "HC54321",
      valid_until: new Date("2024-10-15"),
      active: true
    },
    {
      patient_id: aliceJohnson,
      insurance_id: lifeWell,
      insurance_number: "LW67890",
      valid_until: new Date("2024-08-20"),
      active: true
    },
    {
      patient_id: bobSmith,
      insurance_id: wellMed,
      insurance_number: "WM09876",
      valid_until: new Date("2024-05-10"),
      active: true
    },
    {
      patient_id: johnDoe,
      insurance_id: wellMed,
      insurance_number: "WM12345",
      valid_until: new Date("2025-01-15"),
      active: true
    }
  ]);
} 
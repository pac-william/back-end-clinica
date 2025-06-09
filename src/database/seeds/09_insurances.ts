import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("insurances").del();

  // Insere os registros iniciais
  await knex("insurances").insert([
    {
      name: "MedPlus",
      plan_type: "Basic",
      discount_percentage: 20.00,
      contact_phone: "(11) 5555-1234",
      contact_email: "contact@medplus.com",
      registration_number: "12345678",
      active: true
    },
    {
      name: "HealthCare",
      plan_type: "Premium",
      discount_percentage: 25.00,
      contact_phone: "(11) 5555-5678",
      contact_email: "contact@healthcare.com",
      registration_number: "87654321",
      active: true
    },
    {
      name: "LifeWell",
      plan_type: "Business",
      discount_percentage: 15.00,
      contact_phone: "(11) 5555-9012",
      contact_email: "contact@lifewell.com",
      registration_number: "23456789",
      active: true
    },
    {
      name: "WellMed",
      plan_type: "Complete",
      discount_percentage: 30.00,
      contact_phone: "(11) 5555-3456",
      contact_email: "contact@wellmed.com",
      registration_number: "98765432",
      active: true
    }
  ]);
} 
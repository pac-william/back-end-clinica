import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("specialties").del();

  // Insere os registros iniciais
  await knex("specialties").insert([
    { name: "General Practice" },
    { name: "Cardiology" },
    { name: "Dermatology" },
    { name: "Gynecology" },
    { name: "Orthopedics" },
    { name: "Pediatrics" },
    { name: "Psychiatry" },
    { name: "Neurology" },
    { name: "Ophthalmology" },
    { name: "Urology" },
    { name: "Endocrinology" },
    { name: "Gastroenterology" }
  ]);
} 
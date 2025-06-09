import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("exams").del();

  // Insere os registros iniciais
  await knex("exams").insert([
    {
      name: "Complete Blood Count",
      description: "Blood test for general evaluation",
      price: 50.00,
      active: true
    },
    {
      name: "Blood Glucose",
      description: "Test to measure blood glucose levels",
      price: 30.00,
      active: true
    },
    {
      name: "Chest X-Ray",
      description: "Chest radiography",
      price: 120.00,
      active: true
    },
    {
      name: "Abdominal Ultrasound",
      description: "Abdominal imaging exam",
      price: 180.00,
      active: true
    },
    {
      name: "Electrocardiogram",
      description: "Test to evaluate the electrical activity of the heart",
      price: 90.00,
      active: true
    },
    {
      name: "Colonoscopy",
      description: "Examination of the large intestine",
      price: 350.00,
      active: true
    },
    {
      name: "MRI Scan",
      description: "Magnetic resonance imaging",
      price: 500.00,
      active: true
    },
    {
      name: "CT Scan",
      description: "Computed tomography scan",
      price: 450.00,
      active: true
    }
  ]);
} 
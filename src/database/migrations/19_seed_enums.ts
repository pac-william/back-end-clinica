import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Seed para exames comuns
  await knex('exams').insert([
    { name: 'Complete Blood Count', description: 'Blood test for general evaluation', price: 50.00 },
    { name: 'Blood Glucose', description: 'Test to measure blood glucose levels', price: 30.00 },
    { name: 'Chest X-Ray', description: 'Chest radiography', price: 120.00 },
    { name: 'Abdominal Ultrasound', description: 'Abdominal imaging exam', price: 180.00 },
    { name: 'Electrocardiogram', description: 'Test to evaluate the electrical activity of the heart', price: 90.00 }
  ]);

  // Seed para convênios comuns
  await knex('insurances').insert([
    { name: 'Unimed', plan_type: 'Basic', discount_percentage: 20.00 },
    { name: 'Amil', plan_type: 'Premium', discount_percentage: 25.00 },
    { name: 'SulAmerica', plan_type: 'Business', discount_percentage: 15.00 },
    { name: 'Bradesco Health', plan_type: 'Complete', discount_percentage: 30.00 }
  ]);

  // Seed para especialidades médicas
  await knex('specialties').insert([
    { name: 'General Practice' },
    { name: 'Cardiology' },
    { name: 'Dermatology' },
    { name: 'Gynecology' },
    { name: 'Orthopedics' },
    { name: 'Pediatrics' },
    { name: 'Psychiatry' },
    { name: 'Neurology' }
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('specialties').del();
  await knex('insurances').del();
  await knex('exams').del();
} 
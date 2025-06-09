import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("doctors").del();

  // Obtem os IDs dos usuários criados
  const users = await knex("users")
    .whereIn("email", ["doctor1@clinica.com", "doctor2@clinica.com"])
    .select("id", "email");

  const doctor1UserId = users.find(u => u.email === "doctor1@clinica.com")?.id;
  const doctor2UserId = users.find(u => u.email === "doctor2@clinica.com")?.id;

  // Insere os registros iniciais
  await knex("doctors").insert([
    {
      name: "Dr. Michael Johnson",
      crm: "12345-SP",
      phone: "(11) 98765-1234",
      email: "doctor1@clinica.com",
      user_id: doctor1UserId,
      active: true
    },
    {
      name: "Dr. Sarah Williams",
      crm: "54321-SP",
      phone: "(11) 98765-5678",
      email: "doctor2@clinica.com",
      user_id: doctor2UserId,
      active: true
    },
    {
      name: "Dr. Robert Davis",
      crm: "67890-SP",
      phone: "(11) 98765-9012",
      email: "robert.davis@clinica.com",
      active: true
    },
    {
      name: "Dr. Jennifer Miller",
      crm: "09876-SP",
      phone: "(11) 98765-3456",
      email: "jennifer.miller@clinica.com",
      active: true
    }
  ]);
} 
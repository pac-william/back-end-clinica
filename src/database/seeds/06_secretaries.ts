import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("secretaries").del();

  // Obtem os IDs dos usuários criados
  const users = await knex("users")
    .where("email", "secretary@clinica.com")
    .select("id", "email");

  const secretaryUserId = users[0]?.id;

  // Insere os registros iniciais
  await knex("secretaries").insert([
    {
      name: "Emily Brown",
      phone: "(11) 98888-7777",
      email: "secretary@clinica.com",
      user_id: secretaryUserId,
      active: true
    },
    {
      name: "David Wilson",
      phone: "(11) 99999-8888",
      email: "david.wilson@clinica.com",
      active: true
    }
  ]);
} 
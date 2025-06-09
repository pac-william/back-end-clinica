import bcrypt from "bcrypt";
import dotenv from "dotenv";
import type { Knex } from "knex";
import { UserRole } from "../../enums/UserRole";

// Carrega as variáveis de ambiente
dotenv.config();

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("users").del();

  // Criptografa as senhas
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("123456", salt);
  const adminPassword = await bcrypt.hash("admin123", salt);
  const masterPassword = await bcrypt.hash(process.env.MASTER_PASSWORD || "123", salt);
  
  // Insere os registros iniciais
  await knex("users").insert([
    {
      email: process.env.MASTER_EMAIL || "master@clinica.com",
      password: masterPassword,
      role: UserRole.MASTER,
      active: true
    },
    {
      email: "admin@clinica.com",
      password: adminPassword,
      role: UserRole.ADMIN,
      active: true
    },
    {
      email: "johndoe@email.com",
      password: password,
      role: UserRole.USER,
      active: true
    },
    {
      email: "janedoe@email.com",
      password: password,
      role: UserRole.USER,
      active: true
    }
  ]);
} 
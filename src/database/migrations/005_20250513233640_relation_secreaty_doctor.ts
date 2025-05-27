import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("secretarys", (table) => {
    table
      .integer("doctor_id")
      .references("id")
      .inTable("doctors")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("secretarys", (table) => {
    table.dropForeign(["doctor_id"]);
    table.dropColumn("doctor_id");
  });
}

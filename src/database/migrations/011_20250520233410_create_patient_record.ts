import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('patient_record', (table) => {
    table.increments('id').primary();
    
    table
      .integer('doctor_id')
      .unsigned()
      .references('id')
      .inTable('doctors')
      .onDelete('CASCADE')
      .notNullable();

    table
      .integer('patient_id')
      .unsigned()
      .references('id')
      .inTable('patients')
      .onDelete('CASCADE')
      .notNullable();

    table.text('description', 'longtext').notNullable();

    table.timestamps(true, true); // created_at e updated_at com default current_timestamp
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('patient_record');
}

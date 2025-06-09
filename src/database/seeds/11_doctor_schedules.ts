import type { Knex } from "knex";
import { DayOfWeek } from "../../enums/DayOfWeek";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("doctor_schedules").del();

  // Obter IDs dos médicos
  const doctors = await knex("doctors").select("id", "name");

  // Encontrar IDs específicos
  const drMichael = doctors.find(d => d.name === "Dr. Michael Johnson")?.id;
  const drSarah = doctors.find(d => d.name === "Dr. Sarah Williams")?.id;
  const drRobert = doctors.find(d => d.name === "Dr. Robert Davis")?.id;
  const drJennifer = doctors.find(d => d.name === "Dr. Jennifer Miller")?.id;

  // Insere os registros iniciais
  await knex("doctor_schedules").insert([
    // Dr. Michael - Segunda, Quarta e Sexta de manhã
    {
      doctor_id: drMichael,
      day_of_week: DayOfWeek.MONDAY,
      start_time: "08:00:00",
      end_time: "12:00:00",
      appointment_duration: 30,
      active: true
    },
    {
      doctor_id: drMichael,
      day_of_week: DayOfWeek.WEDNESDAY,
      start_time: "08:00:00",
      end_time: "12:00:00",
      appointment_duration: 30,
      active: true
    },
    {
      doctor_id: drMichael,
      day_of_week: DayOfWeek.FRIDAY,
      start_time: "08:00:00",
      end_time: "12:00:00",
      appointment_duration: 30,
      active: true
    },
    
    // Dr. Sarah - Terça e Quinta à tarde
    {
      doctor_id: drSarah,
      day_of_week: DayOfWeek.TUESDAY,
      start_time: "13:00:00",
      end_time: "17:00:00",
      appointment_duration: 45,
      active: true
    },
    {
      doctor_id: drSarah,
      day_of_week: DayOfWeek.THURSDAY,
      start_time: "13:00:00",
      end_time: "17:00:00",
      appointment_duration: 45,
      active: true
    },
    
    // Dr. Robert - Segunda à noite e Sábado de manhã
    {
      doctor_id: drRobert,
      day_of_week: DayOfWeek.MONDAY,
      start_time: "18:00:00",
      end_time: "22:00:00",
      appointment_duration: 30,
      active: true
    },
    {
      doctor_id: drRobert,
      day_of_week: DayOfWeek.SATURDAY,
      start_time: "08:00:00",
      end_time: "12:00:00",
      appointment_duration: 30,
      active: true
    },
    
    // Dr. Jennifer - Quarta e Sexta à tarde
    {
      doctor_id: drJennifer,
      day_of_week: DayOfWeek.WEDNESDAY,
      start_time: "13:00:00",
      end_time: "17:00:00",
      appointment_duration: 60,
      active: true
    },
    {
      doctor_id: drJennifer,
      day_of_week: DayOfWeek.FRIDAY,
      start_time: "13:00:00",
      end_time: "17:00:00",
      appointment_duration: 60,
      active: true
    }
  ]);
} 
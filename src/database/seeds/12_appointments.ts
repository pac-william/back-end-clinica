import type { Knex } from "knex";
import { AppointmentStatus } from "../../enums/AppointmentStatus";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes
  await knex("appointments").del();

  // Obter IDs dos médicos
  const doctors = await knex("doctors").select("id", "name");
  
  // Obter IDs dos pacientes
  const patients = await knex("patients").select("id", "name");

  // Encontrar IDs específicos
  const drMichael = doctors.find(d => d.name === "Dr. Michael Johnson")?.id;
  const drSarah = doctors.find(d => d.name === "Dr. Sarah Williams")?.id;
  const drRobert = doctors.find(d => d.name === "Dr. Robert Davis")?.id;
  const drJennifer = doctors.find(d => d.name === "Dr. Jennifer Miller")?.id;

  const johnDoe = patients.find(p => p.name === "John Doe")?.id;
  const janeDoe = patients.find(p => p.name === "Jane Doe")?.id;
  const aliceJohnson = patients.find(p => p.name === "Alice Johnson")?.id;
  const bobSmith = patients.find(p => p.name === "Bob Smith")?.id;
  const carolWhite = patients.find(p => p.name === "Carol White")?.id;

  // Gerar data de consulta para a próxima segunda-feira às 9h
  const nextMonday = getNextDayOfWeek(new Date(), 1); // 1 = Monday
  nextMonday.setHours(9, 0, 0, 0);
  
  // Gerar data de consulta para a próxima terça-feira às 14h
  const nextTuesday = getNextDayOfWeek(new Date(), 2); // 2 = Tuesday
  nextTuesday.setHours(14, 0, 0, 0);
  
  // Gerar data de consulta para a próxima quarta-feira às 10h
  const nextWednesday = getNextDayOfWeek(new Date(), 3); // 3 = Wednesday
  nextWednesday.setHours(10, 0, 0, 0);
  
  // Gerar data de consulta para a próxima quarta-feira às 15h
  const nextWednesdayAfternoon = getNextDayOfWeek(new Date(), 3); // 3 = Wednesday
  nextWednesdayAfternoon.setHours(15, 0, 0, 0);
  
  // Gerar data de consulta para a próxima quinta-feira às 14h
  const nextThursday = getNextDayOfWeek(new Date(), 4); // 4 = Thursday
  nextThursday.setHours(14, 0, 0, 0);
  
  // Gerar data de consulta para a próxima sexta-feira às 11h
  const nextFriday = getNextDayOfWeek(new Date(), 5); // 5 = Friday
  nextFriday.setHours(11, 0, 0, 0);
  
  // Gerar data de consulta para a próxima sexta-feira às 16h
  const nextFridayAfternoon = getNextDayOfWeek(new Date(), 5); // 5 = Friday
  nextFridayAfternoon.setHours(16, 0, 0, 0);
  
  // Consulta no passado (há 3 dias)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  threeDaysAgo.setHours(10, 30, 0, 0);
  
  // Consulta no passado (há 5 dias)
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  fiveDaysAgo.setHours(15, 30, 0, 0);

  // Insere os registros iniciais
  await knex("appointments").insert([
    {
      patient_id: johnDoe,
      doctor_id: drMichael,
      date: nextMonday,
      status: AppointmentStatus.SCHEDULED,
      notes: "Regular check-up"
    },
    {
      patient_id: janeDoe,
      doctor_id: drSarah,
      date: nextTuesday,
      status: AppointmentStatus.CONFIRMED,
      notes: "Skin consultation"
    },
    {
      patient_id: aliceJohnson,
      doctor_id: drMichael,
      date: nextWednesday,
      status: AppointmentStatus.SCHEDULED,
      notes: "Cardiac evaluation"
    },
    {
      patient_id: bobSmith,
      doctor_id: drJennifer,
      date: nextWednesdayAfternoon,
      status: AppointmentStatus.SCHEDULED,
      notes: "Neurology consultation"
    },
    {
      patient_id: carolWhite,
      doctor_id: drSarah,
      date: nextThursday,
      status: AppointmentStatus.SCHEDULED,
      notes: "Dermatology follow-up"
    },
    {
      patient_id: johnDoe,
      doctor_id: drRobert,
      date: nextFriday,
      status: AppointmentStatus.SCHEDULED,
      notes: "Pediatric consultation for son"
    },
    {
      patient_id: janeDoe,
      doctor_id: drJennifer,
      date: nextFridayAfternoon,
      status: AppointmentStatus.SCHEDULED,
      notes: "Neurology follow-up"
    },
    {
      patient_id: aliceJohnson,
      doctor_id: drMichael,
      date: threeDaysAgo,
      status: AppointmentStatus.COMPLETED,
      notes: "Regular check-up completed"
    },
    {
      patient_id: bobSmith,
      doctor_id: drSarah,
      date: fiveDaysAgo,
      status: AppointmentStatus.CANCELED,
      notes: "Patient canceled due to illness"
    }
  ]);
}

// Função auxiliar para obter a próxima data de um determinado dia da semana
function getNextDayOfWeek(date: Date, dayOfWeek: number): Date {
  const resultDate = new Date(date.getTime());
  resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
  return resultDate;
} 
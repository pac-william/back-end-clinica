import { z } from 'zod';

export const AppointmentDTO = z.object({
  patientId: z.number().int('ID do paciente deve ser um número inteiro'),
  doctorId: z.number().int('ID do médico deve ser um número inteiro'),
  date: z.string().or(z.date()).transform(val => new Date(val)),
  status: z.enum(['AGENDADO', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']).default('AGENDADO')
});

export type AppointmentDTO = z.infer<typeof AppointmentDTO>; 
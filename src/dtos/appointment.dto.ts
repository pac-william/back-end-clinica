import { z } from 'zod';
import { AppointmentStatus } from '../enums/AppointmentStatus';

export const AppointmentDTO = z.object({
  patientId: z.number().int('ID do paciente deve ser um número inteiro'),
  doctorId: z.number().int('ID do médico deve ser um número inteiro'),
  date: z.string().or(z.date()).transform(val => new Date(val)),
  status: z.nativeEnum(AppointmentStatus).default(AppointmentStatus.SCHEDULED)
});

export type AppointmentDTO = z.infer<typeof AppointmentDTO>; 
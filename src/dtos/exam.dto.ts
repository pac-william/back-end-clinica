import { z } from 'zod';

export const ExamDTO = z.object({
  patientId: z.number().int('ID do paciente deve ser um número inteiro'),
  doctorId: z.number().int('ID do médico deve ser um número inteiro'),
  type: z.string().min(3, 'Tipo de exame deve ter pelo menos 3 caracteres'),
  date: z.string().or(z.date()).transform(val => new Date(val)),
  result: z.string().optional(),
  status: z.enum(['SOLICITADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).default('SOLICITADO')
});

export type ExamDTO = z.infer<typeof ExamDTO>; 
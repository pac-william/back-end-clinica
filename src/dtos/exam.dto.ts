import { z } from 'zod';
import { ExamStatus } from '../enums/ExamStatus';

export const ExamDTO = z.object({
  appointmentId: z.number().int('ID da consulta deve ser um número inteiro'),
  examId: z.number().int('ID do exame deve ser um número inteiro'),
  scheduledDate: z.string().or(z.date()).optional().transform(val => val ? new Date(val) : undefined),
  resultDate: z.string().or(z.date()).optional().transform(val => val ? new Date(val) : undefined),
  status: z.nativeEnum(ExamStatus).default(ExamStatus.REQUESTED),
  result: z.string().optional(),
  notes: z.string().optional()
});

export type ExamDTO = z.infer<typeof ExamDTO>; 
import { z } from 'zod';
import { PaymentMethod } from '../enums/PaymentMethod';
import { PaymentStatus } from '../enums/PaymentStatus';

export const PaymentDTO = z.object({
  appointmentId: z.number().int('ID da consulta deve ser um número inteiro'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  amount: z.number().positive('Valor deve ser positivo'),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  insuranceId: z.number().int('ID do convênio deve ser um número inteiro').optional(),
  transactionId: z.string().optional(),
  paymentDate: z.string().or(z.date()).optional().transform(val => val ? new Date(val) : undefined),
  notes: z.string().optional()
});

export type PaymentDTO = z.infer<typeof PaymentDTO>; 
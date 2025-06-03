import { z } from 'zod';

export const PaymentDTO = z.object({
  appointmentId: z.number().int('ID da consulta deve ser um número inteiro'),
  amount: z.number().positive('Valor deve ser positivo'),
  paymentMethod: z.enum(['DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'CONVENIO']),
  paymentDate: z.string().or(z.date()).transform(val => new Date(val)).optional(),
  status: z.enum(['PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO']).default('PENDENTE'),
  insuranceId: z.number().int('ID do convênio deve ser um número inteiro').optional()
});

export type PaymentDTO = z.infer<typeof PaymentDTO>; 
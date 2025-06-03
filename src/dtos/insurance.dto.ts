import { z } from 'zod';

export const InsuranceDTO = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  contactPhone: z.string().min(8, 'Telefone deve ter pelo menos 8 dígitos').optional()
});

export type InsuranceDTO = z.infer<typeof InsuranceDTO>; 
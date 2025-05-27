import { z } from 'zod';

export const DoctorDTO = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  crm: z.string().min(4, 'CRM deve ter pelo menos 4 caracteres'),
  specialties: z.array(z.number()),
  phone: z.string(),
  email: z.string().email('Email inválido')
});

export type DoctorDTO = z.infer<typeof DoctorDTO>;

import { z } from 'zod';

export const doctorDTO = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  crm: z.string().min(4, 'CRM deve ter pelo menos 4 caracteres'),
  specialties: z.array(z.number()).min(1, 'Médico deve ter pelo menos uma especialidade'),
  phone: z.string(),
  email: z.string().email('Email inválido')
});

export type DoctorDTO = z.infer<typeof doctorDTO>;

import { z } from 'zod';

export const patientDTO = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  address: z.string().min(3, 'Endereço deve ter pelo menos 3 caracteres'),
  phone: z.string().min(11, 'Telefone deve ter pelo menos 11 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres'),
});

export type PatientDTO = z.infer<typeof patientDTO>;

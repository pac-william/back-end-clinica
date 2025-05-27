import { z } from 'zod';

export const patientDTO = z.object({
  id: z.number().optional(),
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  address: z.string().min(3, 'Endereço deve ter pelo menos 3 caracteres'),
  phone: z.string().min(11, 'Telefone deve ter pelo menos 11 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres'),
  birth_date: z.coerce.date({ required_error: 'Data de nascimento é obrigatória' }),
});

export type PatientDTO = z.infer<typeof patientDTO>;

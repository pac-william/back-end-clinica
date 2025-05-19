import { z } from 'zod';

export const secretaryDTO = z.object({
  name: z.string().min(3, {
    message: 'Nome deve ter pelo menos 3 caracteres',
  }),
  department: z.string().min(1, 'Departamento é obrigatório').nullable().optional(),
  phone: z.string().regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Telefone inválido').nullable().optional(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').nullable().optional(),
  doctor_id: z.number()
});

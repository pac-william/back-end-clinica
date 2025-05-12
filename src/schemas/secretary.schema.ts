import { z } from 'zod';

export const secretarySchema = z.object({
  name: z.string().min(3, {
    message: 'Nome deve ter pelo menos 3 caracteres',
  }),
  coren: z.string()
    .min(2, 'COREN deve ter pelo menos 2 dígitos')
    .max(6, 'COREN deve ter no máximo 6 dígitos')
    .regex(/^[0-9]+$/, 'COREN deve conter apenas números')
    .nullable()
    .optional(),
  specialtyId: z.number().nullable().optional(),
  department: z.string().min(1, 'Departamento é obrigatório').nullable().optional(),
  phone: z.string().regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Telefone inválido').nullable().optional(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').nullable().optional(),
});

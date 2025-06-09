import { z } from 'zod';

export const secretaryDTO = z.object({
  name: z.string().min(3, {
    message: 'Nome deve ter pelo menos 3 caracteres',
  }),
  department: z.string().min(1, 'Departamento é obrigatório').nullable().optional(),
  phone: z.string().regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Telefone inválido').nullable().optional(),
  email: z.string().email('Email inválido').nullable().optional(),
  user_id: z.number().optional(),
  active: z.boolean().optional()
});

import { z } from 'zod';

export const createSpecialtyDTO = z.object({
  name: z.string().min(3, {
    message: 'Nome deve ter pelo menos 3 caracteres',
  }),
});

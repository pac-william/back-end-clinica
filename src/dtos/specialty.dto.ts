import { z } from 'zod';

export const createSpecialtyDTO = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres',
  }),
});

export type CreateSpecialtyDTO = z.infer<typeof createSpecialtyDTO>;

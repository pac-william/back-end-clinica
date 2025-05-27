import { z } from 'zod';

export const SpecialtyDTO = z.object({
  id: z.number(),
  name: z.string().min(3, {
    message: 'Nome deve ter pelo menos 3 caracteres',
  }),
});

export type SpecialtyDTO = z.infer<typeof SpecialtyDTO>;

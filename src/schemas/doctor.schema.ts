import { z } from 'zod';

export const doctorSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  specialty_id: z.string(),
  phone: z.string()
});

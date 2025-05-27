import { z } from 'zod';

export const userDTO = z.object({
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['USER', 'ADMIN', 'MASTER']),
    role_id: z.number(),
});

export const loginDTO = z.object({
    email: z.string().email(),
    password: z.string(),
});
import { z } from 'zod';

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['DOCTOR', 'SECRETARY', 'PATIENT']),
    role_id: z.number(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
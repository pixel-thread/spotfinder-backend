import { z } from 'zod';

export const authSchema = z.object({
  phone: z
    .string({ required_error: 'Phone is required' })
    .min(10, { message: 'Min 10 Required' })
    .max(10, { message: 'Max 10 Required' }),
  otp: z
    .string({ required_error: 'Password is required' })
    .min(5, { message: 'Min 5 Required' })
    .max(5, { message: 'Max 5 Required' }),
});

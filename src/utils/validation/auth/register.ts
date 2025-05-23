import { z } from 'zod';
import { authSchema } from '.';

export const registerSchema = authSchema.extend({
  email: z.string({ required_error: 'Email is required' }).email(),
  name: z.string({ required_error: 'Name is required' }),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']).optional(),
  otp: z.string().min(6, { message: 'Invalid OTP' }).max(6, 'Invalid OTP'),
});

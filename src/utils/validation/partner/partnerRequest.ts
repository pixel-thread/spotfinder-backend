import { z } from 'zod';

export const partnerRequestSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
  description: z.string(),
  reviewBy: z.string().uuid().optional(),
  reviewNotes: z.string().optional(),
  user: z.object({ id: z.string().uuid() }).optional(),
});

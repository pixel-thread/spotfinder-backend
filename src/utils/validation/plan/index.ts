import { z } from 'zod';

export const planSchema = z.object({
  id: z.string().uuid().optional(),
  price: z.number(),
  duration: z.number().min(1).optional(),
  status: z.enum(['INACTIVE', 'ACTIVE']).optional(),
});

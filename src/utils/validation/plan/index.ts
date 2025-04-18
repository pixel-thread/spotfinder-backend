import { z } from 'zod';

export const planSchama = z.object({
  id: z.string().uuid().optional(),
  price: z.number(),
});

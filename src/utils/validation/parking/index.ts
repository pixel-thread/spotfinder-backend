import { z } from 'zod';

export const parkingSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  price: z.string().default('30'),
  description: z.string(),
  distance: z.string().optional().nullable(),
  openHours: z.string().optional(),
  image: z.string().url().optional(),
  rating: z.array(z.string().uuid()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE').optional(),
  features: z
    .string()
    .transform((val) => val.split(','))
    .optional(),
  gallery: z.array(z.string()).optional(),
  userId: z.string().uuid(),
});

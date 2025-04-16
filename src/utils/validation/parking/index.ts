import { z } from 'zod';

export const parkingSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  address: z.string(),
  price: z.number(),
  rating: z.array(z.string().uuid()).optional(),
  distance: z.string().optional(),
  available: z.number(),
  totalSpots: z.number(),
  openHours: z.string().optional(),
  description: z.string(),
  image: z.string().url().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE').optional(),
  features: z.array(z.string()),
  gallery: z.array(z.string()),
  userId: z.string().uuid().optional().nullable(),
});

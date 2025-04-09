import { z } from "zod";

export const staffSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  password: z.string(),
  name: z.string(),
});

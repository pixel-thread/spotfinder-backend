import { z } from "zod";

export const classSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  schoolId: z.string().uuid(),
});

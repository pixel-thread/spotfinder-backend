import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string(),
  staffId: z.string(),
  classId: z.string(),
});

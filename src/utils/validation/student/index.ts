import { z } from "zod";

export const studentSchema = z.object({
  name: z.string(),
  schoolId: z.string(),
  classId: z.string(),
});

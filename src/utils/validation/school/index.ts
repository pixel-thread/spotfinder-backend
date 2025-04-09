import { z } from "zod";

export const schoolSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
});

import { z } from "zod";
import { authSchema } from ".";

export const registerSchema = authSchema.extend({
  name: z.string({ required_error: "Name is required" }),
  phone: z.string({ required_error: "Phone is required" }),
});

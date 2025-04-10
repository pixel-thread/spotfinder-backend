import { z } from "zod";

export const authSchema = z.object({
  phone: z.string({ required_error: "Phone is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Min 8 Required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
      },
    ),
});

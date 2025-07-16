import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/~`]/,
      "Password must contain at least one special character"
    ),
  avatar: z.union([
    z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Cover image must be less than 5MB",
    }),
    z.string().url().min(1), // Existing image URL
  ]),
});

export type UserData = z.infer<typeof userSchema>;

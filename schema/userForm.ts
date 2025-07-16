import { z } from "zod";

export const registerSchema = z.object({
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
});

export const loginSchema = z.object({
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
});

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    avatar: z
      .any()
      .optional()
      .refine(
        (file) =>
          file.length == 1
            ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
              ? true
              : false
            : true,
        "Invalid file. choose either JPEG or PNG image"
      )
      .refine(
        (file) =>
          file.length == 1
            ? file[0]?.size <= MAX_FILE_SIZE
              ? true
              : false
            : true,
        "Max file size allowed is 8MB."
      ),
    password: z.union([z.string(), z.literal("")]),
    newPassword: z.union([
      z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-zA-Z]/, "Password must contain at least one letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
          /[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/~`]/,
          "Password must contain at least one special character"
        ),
      z.literal(""),
    ]),
    confirmPassword: z.union([z.string(), z.literal("")]),
  })
  .superRefine((data, ctx) => {
    if (data.password || data.newPassword || data.confirmPassword) {
      if (!data.password) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Currnet password is required to change password",
        });
      }

      if (data.newPassword && !data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          code: z.ZodIssueCode.custom,
          message: "Please confirm your new password",
        });
      }

      if (
        data.newPassword &&
        data.confirmPassword &&
        data.newPassword !== data.confirmPassword
      ) {
        ctx.addIssue({
          path: ["confirmPassword"],
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
        });
      }
    }
  });

export type ProfileData = z.infer<typeof profileSchema>;

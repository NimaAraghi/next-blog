import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content cannot be empty"),
  slug: z.string().min(1, "Slug is required"),
  coverImage: z.union([
    z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Cover image must be less than 5MB",
    }),
    z.string().url().min(1), // Existing image URL
  ]),
});

export type PostFormData = z.infer<typeof postSchema>;

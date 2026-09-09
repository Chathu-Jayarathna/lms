import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long." }),
  description: z.string().min(15, { message: "Description must be at least 15 characters long." }),
  category: z.string().min(2, { message: "Category is required." }),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  isPublished: z.boolean().default(false),
});

export type CourseInput = z.infer<typeof courseSchema>;

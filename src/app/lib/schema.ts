import { z } from "zod";

export const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().optional(), // Mood is now optional as it's determined by AI
  collectionId: z.string().optional(),
});

export const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

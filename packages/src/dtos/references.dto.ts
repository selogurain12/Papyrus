import z from "zod";

// Types de référence pour éviter les références circulaires
export const characterRefSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  role: z.enum(["protagonist", "antagonist", "ally", "mentor", "secondary character"]),
});

export const eventRefSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  eventDate: z.string(),
});

export const objectRefSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  importance: z.enum(["low", "medium", "high"]).nullable().optional(),
  type: z.string().nullable().optional(),
});

export const projectRefSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  genre: z.string(),
});

export type CharacterRef = z.infer<typeof characterRefSchema>;
export type EventRef = z.infer<typeof eventRefSchema>;
export type ObjectRef = z.infer<typeof objectRefSchema>;
export type ProjectRef = z.infer<typeof projectRefSchema>;

import { z } from "zod";

export const idSchema = z.object({
  id: z.string().uuid("Le format de l'id est invalide"),
});

export type Id = z.infer<typeof idSchema>;

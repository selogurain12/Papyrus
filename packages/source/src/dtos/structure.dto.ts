import { z } from "zod";

export const createStructureSchema = z.object({
  premise: z.string().nullable(),
  genre: z.string().nullable(),
  theme: z.string().nullable(),
  structure: z.string().nullable(),
  objectives: z.array(z.string()).nullable(),
});

export const structureSchema = createStructureSchema.extend({
  id: z.string().uuid("Invalid structure ID format"),
});

export const updateStructureSchema = createStructureSchema.partial();

export type CreateStructureDto = z.infer<typeof createStructureSchema>;
export type StructureDto = z.infer<typeof structureSchema>;
export type UpdateStructureDto = z.infer<typeof updateStructureSchema>;

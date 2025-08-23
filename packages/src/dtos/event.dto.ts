import { isZonedIso8601 } from "utils/zoned-iso";
import { z } from "zod";
import { projectSchema } from "./projects.dto";
import { objectSchema } from "./objects.dto";

export const createEventSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
  eventDate: z.string().refine(isZonedIso8601),
  createdAt: z.string().refine(isZonedIso8601),
  updatedAt: z.string().refine(isZonedIso8601).optional().nullable(),
  deletedAt: z.string().refine(isZonedIso8601).optional().nullable(),
  project: z.lazy(() => projectSchema),
  objects: z.lazy(() => objectSchema).array(),
});

export const eventSchema = createEventSchema.extend({
  id: z.uuid("Le format de l'id de l'événement est invalide"),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type EventDto = z.infer<typeof eventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;

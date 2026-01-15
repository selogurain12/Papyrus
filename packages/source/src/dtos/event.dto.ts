import { z } from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";

export const createEventSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).nullable(),
  importance: z.enum(["critical", "important", "action", "normal"]).nullable(),
  location: z.string().max(200).nullable(),
  additionalDetails: z.string().max(2000).nullable(),
  eventDate: z.string().refine(isZonedIso8601),
  project: z.lazy(() => projectSchema),
});

export const eventSchema = createEventSchema.extend({
  id: z.string().uuid("Le format de l'id de l'événement est invalide"),
});

export const updateEventSchema = createEventSchema.partial();

export const filterEventSchema = filterSchema.extend({
  importance: z.enum(["critical", "important", "action", "normal"]).array().optional(),
  minDate: z.string().refine(isZonedIso8601).optional(),
  maxDate: z.string().refine(isZonedIso8601).optional(),
});

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type EventDto = z.infer<typeof eventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
export type FilterEventDto = z.infer<typeof filterEventSchema>;

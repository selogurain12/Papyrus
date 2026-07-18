import { z } from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { importanceTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";
import { chapterSchema } from "./chapter.dto";

export const createEventSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Titre trop petit, minimun 2 caractères" })
    .max(100, { message: "Titre trop grand, maximum 100 caractères" }),
  description: z
    .string()
    .max(500, { message: "Description trop grande, maximum 500 caractères" })
    .nullable(),
  importance: z.enum(importanceTypes).nullable(),
  location: z
    .string()
    .max(200, { message: "Localisation trop grande, maximum 200 caractères" })
    .nullable(),
  additionalDetails: z
    .string()
    .max(2000, { message: "Détails additionnels trop grand, 2000 caractères maximum" })
    .nullable(),
  eventDate: z.string().refine(isZonedIso8601),
  project: z.lazy(() => projectSchema),
  chapter: z.lazy(() => chapterSchema).nullable(),
});

export const eventSchema = createEventSchema.extend({
  id: z.string().uuid("Le format de l'id de l'événement est invalide"),
});

export const updateEventSchema = createEventSchema.partial();

export const filterEventSchema = filterSchema.extend({
  importance: z.enum(importanceTypes).array().optional(),
  minDate: z.string().refine(isZonedIso8601).optional(),
  maxDate: z.string().refine(isZonedIso8601).optional(),
});

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type EventDto = z.infer<typeof eventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
export type FilterEventDto = z.infer<typeof filterEventSchema>;

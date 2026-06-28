import z from "zod";

export const exportParams = z.object({
  characters: z.preprocess((value) => {
    if (typeof value === "string") {
      return ["true", "enabled", "1"].includes(value);
    }
    return value;
  }, z.boolean().optional()),
  places: z.preprocess((value) => {
    if (typeof value === "string") {
      return ["true", "enabled", "1"].includes(value);
    }
    return value;
  }, z.boolean().optional()),
  objects: z.preprocess((value) => {
    if (typeof value === "string") {
      return ["true", "enabled", "1"].includes(value);
    }
    return value;
  }, z.boolean().optional()),
  events: z.preprocess((value) => {
    if (typeof value === "string") {
      return ["true", "enabled", "1"].includes(value);
    }
    return value;
  }, z.boolean().optional()),
  notes: z.preprocess((value) => {
    if (typeof value === "string") {
      return ["true", "enabled", "1"].includes(value);
    }
    return value;
  }, z.boolean().optional()),
  researchs: z.preprocess((value) => {
    if (typeof value === "string") {
      return ["true", "enabled", "1"].includes(value);
    }
    return value;
  }, z.boolean().optional()),
});

export type ExportParamsDto = z.infer<typeof exportParams>;

import { z } from "zod";

function createOrderByElement(): z.ZodType {
  return z.union([
    z.record(
      z.string(),
      z.lazy(() => createOrderByElement())
    ),
    z.enum(["asc", "desc"]),
  ]);
}

const orderByElement = createOrderByElement();
const orderBySchema = z.union([
  z.record(z.string(), orderByElement),
  z.record(z.string(), orderByElement).array(),
]);

export const filterSchema = z.object({
  page: z
    .preprocess((value) => {
      if (typeof value === "string") {
        return Number.parseInt(value, 10);
      }
      return value;
    }, z.number().min(1).positive().optional())
    .describe("Page number"),

  itemsPerPage: z
    .preprocess((value) => {
      if (typeof value === "string") {
        return Number.parseInt(value, 10);
      }
      return value;
    }, z.number().min(5).max(100).positive().optional())
    .describe("Take number of items per page"),

  search: z.string().optional().describe("Search by keyword"),

  orderBy: z
    .preprocess((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return {};
        }
      }
      return value;
    }, orderBySchema.optional())
    .describe("Order by multiple key and direction"),

  disablePagination: z
    .preprocess((value) => {
      if (typeof value === "string") {
        return ["true", "enabled", "1"].includes(value);
      }
      return value;
    }, z.boolean().optional())
    .describe("Disable pagination and return all items without pagination (default: false)"),
});

export type FilterDto = z.infer<typeof filterSchema>;

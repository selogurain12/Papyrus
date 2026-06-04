import z from "zod";
import { projectSchema } from "./project.dto";

const JsonPrimitive = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type JsonPrimitiveType = z.infer<typeof JsonPrimitive>;

export const JsonValue: z.ZodType<JsonValueType> = z.lazy(() =>
  z.union([JsonPrimitive, z.array(JsonValue), z.record(JsonValue)])
);
export type JsonValueType = JsonPrimitiveType | JsonValueType[] | { [key: string]: JsonValueType };

export const MindNodeSchema: z.ZodType<MindNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    topic: z.string(),
    expanded: z.boolean().optional(),
    direction: z.enum(["left", "right"]).optional(),
    style: JsonValue.optional(),
    children: z.array(MindNodeSchema).optional(),
  })
);

export type MindNode = {
  id: string;
  topic: string;
  expanded?: boolean;
  direction?: "left" | "right";
  style?: JsonValueType;
  children?: MindNode[];
};

export const MindElixirDataSchema = z.object({
  nodeData: MindNodeSchema,
  linkData: z
    .array(
      z.object({
        id: z.string(),
        from: z.string(),
        to: z.string(),
        label: z.string().optional(),
      })
    )
    .optional(),
  theme: JsonValue.optional(),
});

export type MindElixirData = z.infer<typeof MindElixirDataSchema>;

export const createMindMapSchema = z.object({
  title: z.string().min(1).max(100),
  data: MindElixirDataSchema,
  project: z.lazy(() => projectSchema),
});

export const mindMapSchema = createMindMapSchema.extend({
  id: z.string().uuid("Le format de l'id de la carte mentale est invalide"),
});

export const updateMindMapSchema = createMindMapSchema.partial();

export type CreateMindMapDto = z.infer<typeof createMindMapSchema>;
export type MindMapDto = z.infer<typeof mindMapSchema>;
export type UpdateMindMapDto = z.infer<typeof updateMindMapSchema>;

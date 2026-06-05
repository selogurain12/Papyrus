import z from "zod";
import { projectSchema } from "./project.dto";

export interface MindTheme {
  name: string;
  type?: "light" | "dark";
  palette: string[];
  cssVar: {
    "--node-gap-x": string;
    "--node-gap-y": string;
    "--main-gap-x": string;
    "--main-gap-y": string;
    "--main-color": string;
    "--main-bgcolor": string;
    "--main-bgcolor-transparent": string;
    "--color": string;
    "--bgcolor": string;
    "--selected": string;
    "--accent-color": string;
    "--root-color": string;
    "--root-bgcolor": string;
    "--root-border-color": string;
    "--root-radius": string;
    "--main-radius": string;
    "--topic-padding": string;
    "--panel-color": string;
    "--panel-bgcolor": string;
    "--panel-border-color": string;
    "--map-padding": string;
  };
};

export interface NodeObj<M = unknown> {
  topic: string;
  id: string;
  style?: {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    background?: string;
    fontWeight?: string;
    width?: string;
    border?: string;
    textDecoration?: string;
  };
  children?: NodeObj[];
  expanded?: boolean;
  direction?: 0 | 1 | 2;
  tags?: (string | { text: string; style?: Partial<CSSStyleDeclaration> | Record<string, string>; className?: string })[];
  icons?: string[];
  hyperLink?: string;
  image?: {
    url: string;
    width: number;
    height: number;
    fit?: "fill" | "contain" | "cover";
  };
  branchColor?: string;
  parent?: NodeObj;
  dangerouslySetInnerHTML?: string;
  note?: string;
  metadata?: M;
}

export type MindElixirData = {
  nodeData: NodeObj;
  arrows?: unknown[];
  summaries?: unknown[];
  direction?: 0 | 1 | 2;
  theme?: MindTheme;
};

export const NodeObjSchema: z.ZodType<NodeObj> = z.lazy(() =>
  z.object({
    id: z.string(),
    topic: z.string(),
    expanded: z.boolean().optional(),
    direction: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
    style: z
      .object({
        fontSize: z.string().optional(),
        fontFamily: z.string().optional(),
        color: z.string().optional(),
        background: z.string().optional(),
        fontWeight: z.string().optional(),
        width: z.string().optional(),
        border: z.string().optional(),
        textDecoration: z.string().optional(),
      })
      .partial()
      .optional(),
    children: z.array(z.lazy(() => NodeObjSchema)).optional(),
  })
);

export const ThemeSchema: z.ZodType<MindTheme> = z.object({
  name: z.string(),
  type: z.enum(["light", "dark"]).optional(),
  palette: z.array(z.string()),
  cssVar: z.object({
    "--node-gap-x": z.string(),
    "--node-gap-y": z.string(),
    "--main-gap-x": z.string(),
    "--main-gap-y": z.string(),
    "--main-color": z.string(),
    "--main-bgcolor": z.string(),
    "--main-bgcolor-transparent": z.string(),
    "--color": z.string(),
    "--bgcolor": z.string(),
    "--selected": z.string(),
    "--accent-color": z.string(),
    "--root-color": z.string(),
    "--root-bgcolor": z.string(),
    "--root-border-color": z.string(),
    "--root-radius": z.string(),
    "--main-radius": z.string(),
    "--topic-padding": z.string(),
    "--panel-color": z.string(),
    "--panel-bgcolor": z.string(),
    "--panel-border-color": z.string(),
    "--map-padding": z.string(),
  }),
});

export const MindElixirDataSchema: z.ZodType<MindElixirData> = z.object({
  nodeData: NodeObjSchema,
  arrows: z.any().optional(),
  summaries: z.any().optional(),
  direction: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  theme: ThemeSchema.optional(),
});

export const createMindMapSchema = z.object({
  title: z.string().min(1).max(100),
  data: MindElixirDataSchema,
  project: z.lazy(() => projectSchema),
});

export const mindMapSchema = createMindMapSchema.extend({
  id: z.string().uuid("Le format de l'id de la carte mentale est invalide"),
});

export const updateMindMapSchema = createMindMapSchema.partial();

export type MindNode = NodeObj;
export type MindMapDto = z.infer<typeof mindMapSchema>;
export type CreateMindMapDto = z.infer<typeof createMindMapSchema>;
export type UpdateMindMapDto = z.infer<typeof updateMindMapSchema>;

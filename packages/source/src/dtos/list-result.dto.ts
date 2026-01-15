import { z } from "zod";

export function ListResultSchema<Data extends z.ZodType>(
  dataSchema: Data
): z.ZodType<{
  data: z.infer<Data>[];
  total: number;
}> {
  return z.object({
    data: z.array(dataSchema),
    total: z.number(),
  }) as z.ZodType<{
    data: z.infer<Data>[];
    total: number;
  }>;
}

export interface ListResult<DataType> {
  data: DataType[];
  total: number;
}

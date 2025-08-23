import { z } from "zod";
import { projectSchema } from "./projects.dto";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const registerSchema = z.object({
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),
  email: z.email(),
  password: z.string().min(8),
});

export const userSchema = z.object({
  id: z.uuid("Le format de l'id est invalide"),
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),
  email: z.email(),
  password: z.string().min(8).optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().optional(),
  deletedAt: z.iso.datetime().optional(),
  projects: z
    .lazy(() => projectSchema)
    .array()
    .optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegistertDto = z.infer<typeof registerSchema>;
export type UserDto = z.infer<typeof userSchema>;

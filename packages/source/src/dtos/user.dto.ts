import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z.object({
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),
  email: z.string().email(),
  password: z.string().min(8),
});

export const updateUserSchema = registerSchema.partial();

export const userSchema = z.object({
  id: z.string().uuid("Le format de l'id est invalide"),
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),
  email: z.string().email(),
  password: z.string().min(8).optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

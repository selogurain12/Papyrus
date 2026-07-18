import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Prénom trop petit, minimum 1 caractère" })
    .max(30, { message: "Prénom trop grand, maximum 30 caractères" }),
  lastName: z
    .string()
    .min(1, { message: "Nom de famille trop petit, minimum 1 caractère" })
    .max(30, { message: "Nom de famille trop grand, maximum 30 caractères" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Minimum 8 caractères pour le mot de passe" }),
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

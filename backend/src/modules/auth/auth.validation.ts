import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

export const registerSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: z.string().min(8).max(16).regex(passwordRegex, "Needs 1 uppercase + 1 special char"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8).max(16).regex(passwordRegex, "Needs 1 uppercase + 1 special char"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
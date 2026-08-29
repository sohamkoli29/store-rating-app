import { z } from "zod";
import { Role } from "@prisma/client";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

export const createUserSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: z.string().min(8).max(16).regex(passwordRegex, "Needs 1 uppercase + 1 special char"),
  role: z.nativeEnum(Role),
});

export const createStoreSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  address: z.string().max(400),
  ownerId: z.string().uuid(),
});

const userSortFields = ["name", "email", "address", "role", "createdAt"] as const;
const storeSortFields = ["name", "email", "address", "rating", "createdAt"] as const;

export const listUsersQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  sortBy: z.enum(userSortFields).optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const listStoresQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  sortBy: z.enum(storeSortFields).optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type ListStoresQuery = z.infer<typeof listStoresQuerySchema>;
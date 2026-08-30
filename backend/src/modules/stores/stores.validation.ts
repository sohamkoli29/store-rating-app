import { z } from "zod";

const storeSortFields = ["name", "address", "overallRating"] as const;

export const listStoresQuerySchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  sortBy: z.enum(storeSortFields).optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const submitRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

export type ListStoresQuery = z.infer<typeof listStoresQuerySchema>;
export type SubmitRatingInput = z.infer<typeof submitRatingSchema>;
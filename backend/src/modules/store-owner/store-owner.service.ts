import { PrismaClient } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";

const prisma = new PrismaClient();

export const getDashboard = async (ownerId: string) => {
  const store = await prisma.store.findUnique({
    where: { ownerId },
    include: { ratings: { include: { user: true } } },
  });
  if (!store) throw new ApiError(404, "No store found for this owner");

  const raters = store.ratings.map((r) => ({
    userId: r.user.id,
    name: r.user.name,
    email: r.user.email,
    rating: r.rating,
    ratedAt: r.updatedAt,
  }));

  const averageRating = store.ratings.length
    ? Number((store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(2))
    : 0;

  return {
    store: { id: store.id, name: store.name, address: store.address },
    averageRating,
    totalRatings: store.ratings.length,
    raters,
  };
};
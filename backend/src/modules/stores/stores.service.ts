import { Prisma, PrismaClient } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { ListStoresQuery } from "./stores.validation";

const prisma = new PrismaClient();

type StoreListItem = {
  id: string;
  name: string;
  address: string;
  overallRating: number;
  myRating: number | null;
};

export const listStoresForUser = async (userId: string, query: ListStoresQuery) => {
  const where: Prisma.StoreWhereInput = {
    ...(query.name && { name: { contains: query.name, mode: "insensitive" } }),
    ...(query.address && { address: { contains: query.address, mode: "insensitive" } }),
  };

  const stores = await prisma.store.findMany({ where, include: { ratings: true } });

  const enriched: StoreListItem[] = stores.map((store) => {
    const overallRating = store.ratings.length
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : 0;
    const mine = store.ratings.find((r) => r.userId === userId);
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      overallRating: Number(overallRating.toFixed(2)),
      myRating: mine ? mine.rating : null,
    };
  });

  const dir = query.sortOrder === "desc" ? -1 : 1;
  enriched.sort((a, b) => {
    const field = query.sortBy;
    const aVal = a[field];
    const bVal = b[field];
    if (aVal < bVal) return -1 * dir;
    if (aVal > bVal) return 1 * dir;
    return 0;
  });

  return enriched;
};

export const upsertRating = async (userId: string, storeId: string, rating: number) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new ApiError(404, "Store not found");

  return prisma.rating.upsert({
    where: { userId_storeId: { userId, storeId } },
    update: { rating },
    create: { userId, storeId, rating },
  });
};
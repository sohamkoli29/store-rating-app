import bcrypt from "bcrypt";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import {
  CreateStoreInput,
  CreateUserInput,
  ListStoresQuery,
  ListUsersQuery,
} from "./admin.validation";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

type StoreListItem = {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
  createdAt: Date;
};


export const getDashboard = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
};

export const createUser = async (input: CreateUserInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, address: input.address, passwordHash, role: input.role },
  });

  return { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role };
};

export const createStore = async (input: CreateStoreInput) => {
  const owner = await prisma.user.findUnique({ where: { id: input.ownerId } });
  if (!owner) throw new ApiError(404, "Owner user not found");
  if (owner.role !== Role.STORE_OWNER) throw new ApiError(400, "Owner must be a STORE_OWNER user");

  const existingStore = await prisma.store.findUnique({ where: { ownerId: input.ownerId } });
  if (existingStore) throw new ApiError(409, "This owner already has a store");

  return prisma.store.create({
    data: { name: input.name, email: input.email, address: input.address, ownerId: input.ownerId },
  });
};

export const listUsers = async (query: ListUsersQuery) => {
  const where: Prisma.UserWhereInput = {
    ...(query.name && { name: { contains: query.name, mode: "insensitive" } }),
    ...(query.email && { email: { contains: query.email, mode: "insensitive" } }),
    ...(query.address && { address: { contains: query.address, mode: "insensitive" } }),
    ...(query.role && { role: query.role }),
  };

  return prisma.user.findMany({
    where,
    orderBy: { [query.sortBy]: query.sortOrder } as Prisma.UserOrderByWithRelationInput,
    select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
  });
};

export const listStores = async (query: ListStoresQuery) => {
  const where: Prisma.StoreWhereInput = {
    ...(query.name && { name: { contains: query.name, mode: "insensitive" } }),
    ...(query.email && { email: { contains: query.email, mode: "insensitive" } }),
    ...(query.address && { address: { contains: query.address, mode: "insensitive" } }),
  };

  const stores = await prisma.store.findMany({ where });
  const ratingAverages = await prisma.rating.groupBy({ by: ["storeId"], _avg: { rating: true } });
  const avgMap = new Map(ratingAverages.map((r) => [r.storeId, r._avg.rating ?? 0]));

  const enriched: StoreListItem[] = stores.map((store) => ({
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    rating: Number((avgMap.get(store.id) ?? 0).toFixed(2)),
    createdAt: store.createdAt,
  }));

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

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { store: { include: { ratings: true } } },
  });
  if (!user) throw new ApiError(404, "User not found");

  const base = { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role };

  if (user.role === Role.STORE_OWNER && user.store) {
    const ratings = user.store.ratings;
    const avg = ratings.length ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
    return { ...base, rating: Number(avg.toFixed(2)) };
  }

  return base;
};
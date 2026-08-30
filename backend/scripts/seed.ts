import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function upsertUser(email: string, name: string, address: string, password: string, role: Role) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({ data: { name, email, address, passwordHash, role } });
}

async function main() {
  const admin = await upsertUser(
    "admin@storerating.com",
    "Platform Administrator Account Owner",
    "HQ, Pune, Maharashtra",
    "Admin@1234",
    Role.ADMIN
  );

  const owner1 = await upsertUser(
    "owner1@test.com",
    "Riverside General Store Owner Person",
    "MG Road, Pune, Maharashtra",
    "Passw0rd!",
    Role.STORE_OWNER
  );

  const owner2 = await upsertUser(
    "owner2@test.com",
    "Highland Grocery Mart Owner Person",
    "FC Road, Pune, Maharashtra",
    "Passw0rd!",
    Role.STORE_OWNER
  );

  const user1 = await upsertUser(
    "soham@test.com",
    "Soham Koli Test User Name",
    "Kothrud, Pune, Maharashtra",
    "Passw0rd!",
    Role.NORMAL_USER
  );

  const user2 = await upsertUser(
    "priya@test.com",
    "Priya Sharma Sample Normal User",
    "Baner, Pune, Maharashtra",
    "Passw0rd!",
    Role.NORMAL_USER
  );

  const user3 = await upsertUser(
    "rahul@test.com",
    "Rahul Verma Sample Normal User",
    "Viman Nagar, Pune, Maharashtra",
    "Passw0rd!",
    Role.NORMAL_USER
  );

  let store1 = await prisma.store.findUnique({ where: { ownerId: owner1.id } });
  if (!store1) {
    store1 = await prisma.store.create({
      data: { name: "Riverside General Store", email: "store1@test.com", address: "MG Road, Pune", ownerId: owner1.id },
    });
  }

  let store2 = await prisma.store.findUnique({ where: { ownerId: owner2.id } });
  if (!store2) {
    store2 = await prisma.store.create({
      data: { name: "Highland Grocery Mart", email: "store2@test.com", address: "FC Road, Pune", ownerId: owner2.id },
    });
  }

  const ratings: [string, string, number][] = [
    [user1.id, store1.id, 4],
    [user2.id, store1.id, 5],
    [user3.id, store1.id, 3],
    [user1.id, store2.id, 5],
    [user2.id, store2.id, 4],
  ];

  for (const [userId, storeId, rating] of ratings) {
    await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { rating },
      create: { userId, storeId, rating },
    });
  }

  console.log("Seed complete (existing accounts were left untouched):");
  console.log("  Admin:   admin@storerating.com / Admin@1234");
  console.log("  Owner 1: owner1@test.com / Passw0rd! (Riverside General Store)");
  console.log("  Owner 2: owner2@test.com / Passw0rd! (Highland Grocery Mart)");
  console.log("  User 1:  soham@test.com / Passw0rd!");
  console.log("  User 2:  priya@test.com / Passw0rd!");
  console.log("  User 3:  rahul@test.com / Passw0rd!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
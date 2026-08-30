import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@storerating.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    return;
  }

  const passwordHash = await bcrypt.hash("Admin@1234", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Platform Administrator Account Owner",
      email,
      address: "HQ, Pune, Maharashtra",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("Created admin:", admin.email, "password: Admin@1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
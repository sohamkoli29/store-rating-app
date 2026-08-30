import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { signToken } from "../../utils/jwt";
import { ChangePasswordInput, LoginInput, RegisterInput } from "./auth.validation";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const registerNormalUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, address: input.address, passwordHash, role: Role.NORMAL_USER },
  });

  const token = signToken({ id: user.id, role: user.role });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const token = signToken({ id: user.id, role: user.role });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

export const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const valid = await bcrypt.compare(input.oldPassword, user.passwordHash);
  if (!valid) throw new ApiError(401, "Old password is incorrect");

  const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return { success: true };
};
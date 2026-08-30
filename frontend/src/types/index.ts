export type Role = "ADMIN" | "NORMAL_USER" | "STORE_OWNER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
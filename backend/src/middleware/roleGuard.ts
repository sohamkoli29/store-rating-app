import { RequestHandler } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

export const roleGuard = (...allowedRoles: Role[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized"));
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient role"));
    }
    next();
  };
};
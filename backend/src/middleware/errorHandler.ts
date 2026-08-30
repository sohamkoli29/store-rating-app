import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({ success: false, message: "Validation failed", details: err.flatten() });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message, details: err.details ?? null });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
};
import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";
import { changePasswordSchema, loginSchema, registerSchema } from "./auth.validation";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.registerNormalUser(input);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = changePasswordSchema.parse(req.body);
    const result = await authService.changePassword(req.user!.id, input);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
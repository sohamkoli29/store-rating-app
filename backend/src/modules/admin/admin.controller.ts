import { NextFunction, Request, Response } from "express";
import * as adminService from "./admin.service";
import {
  createStoreSchema,
  createUserSchema,
  listStoresQuerySchema,
  listUsersQuerySchema,
} from "./admin.validation";

export const dashboard = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, data: await adminService.getDashboard() });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createUserSchema.parse(req.body);
    res.status(201).json({ success: true, data: await adminService.createUser(input) });
  } catch (err) {
    next(err);
  }
};

export const createStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createStoreSchema.parse(req.body);
    res.status(201).json({ success: true, data: await adminService.createStore(input) });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listUsersQuerySchema.parse(req.query);
    res.status(200).json({ success: true, data: await adminService.listUsers(query) });
  } catch (err) {
    next(err);
  }
};

export const listStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listStoresQuerySchema.parse(req.query);
    res.status(200).json({ success: true, data: await adminService.listStores(query) });
  } catch (err) {
    next(err);
  }
};

export const getUserDetail = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ success: true, data: await adminService.getUserById(req.params.id) });
  } catch (err) {
    next(err);
  }
};
import { NextFunction, Request, Response } from "express";
import * as storeOwnerService from "./store-owner.service";

export const dashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, data: await storeOwnerService.getDashboard(req.user!.id) });
  } catch (err) {
    next(err);
  }
};
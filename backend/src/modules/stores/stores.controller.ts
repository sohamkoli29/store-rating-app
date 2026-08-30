import { NextFunction, Request, Response } from "express";
import * as storesService from "./stores.service";
import { listStoresQuerySchema, submitRatingSchema } from "./stores.validation";

export const listStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listStoresQuerySchema.parse(req.query);
    res.status(200).json({ success: true, data: await storesService.listStoresForUser(req.user!.id, query) });
  } catch (err) {
    next(err);
  }
};

export const submitRating = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { rating } = submitRatingSchema.parse(req.body);
    const data = await storesService.upsertRating(req.user!.id, req.params.id, rating);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateRating = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { rating } = submitRatingSchema.parse(req.body);
    const data = await storesService.upsertRating(req.user!.id, req.params.id, rating);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
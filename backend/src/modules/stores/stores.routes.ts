import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../../middleware/authenticate";
import { roleGuard } from "../../middleware/roleGuard";
import * as storesController from "./stores.controller";

const router = Router();

router.use(authenticate, roleGuard(Role.NORMAL_USER));

router.get("/", storesController.listStores);
router.post("/:id/ratings", storesController.submitRating);
router.put("/:id/ratings", storesController.updateRating);

export default router;
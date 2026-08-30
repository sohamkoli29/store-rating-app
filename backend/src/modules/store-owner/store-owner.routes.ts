import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../../middleware/authenticate";
import { roleGuard } from "../../middleware/roleGuard";
import * as storeOwnerController from "./store-owner.controller";

const router = Router();

router.use(authenticate, roleGuard(Role.STORE_OWNER));

router.get("/dashboard", storeOwnerController.dashboard);

export default router;
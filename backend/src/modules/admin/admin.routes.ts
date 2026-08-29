import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../../middleware/authenticate";
import { roleGuard } from "../../middleware/roleGuard";
import * as adminController from "./admin.controller";

const router = Router();

router.use(authenticate, roleGuard(Role.ADMIN));

router.get("/dashboard", adminController.dashboard);
router.post("/users", adminController.createUser);
router.post("/stores", adminController.createStore);
router.get("/users", adminController.listUsers);
router.get("/stores", adminController.listStores);
router.get("/users/:id", adminController.getUserDetail);

export default router;
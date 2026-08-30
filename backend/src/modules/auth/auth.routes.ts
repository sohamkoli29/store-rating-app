import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as authController from "./auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/password", authenticate, authController.changePassword);

export default router;
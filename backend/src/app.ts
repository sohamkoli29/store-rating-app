import cors from "cors";
import express from "express";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import storesRoutes from "./modules/stores/stores.routes";
import storeOwnerRoutes from "./modules/store-owner/store-owner.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

app.use(errorHandler);

export default app;
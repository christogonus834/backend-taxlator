// src/router/api.routes.js
// ========================
import express from "express";
import {
	authRoutes,
	historyRoutes,
	taxRoutes,
	vatRoutes,
} from "../router/index.js";

// ======================== API ROUTER ========================
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/history", historyRoutes);
router.use("/tax", taxRoutes);
router.use("/vat", vatRoutes);

export default router;

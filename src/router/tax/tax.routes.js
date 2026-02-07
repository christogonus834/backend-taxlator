// src/router/tax/tax.routes.js

// ========================
import express from "express";
import {
	payePitRoutes,
	freelancerRoutes,
	citRoutes,
} from "../../router/tax/index.js";

const router = express.Router();

// ======================== TAX ROUTES ========================
router.use("/payePit", payePitRoutes);
router.use("/freelancer", freelancerRoutes);
router.use("/cit", citRoutes);

export default router;

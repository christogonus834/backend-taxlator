// src/routers/tax/payePit.routes.js

// =========================
import express from "express";
import { requireAuth } from "../../middlewares/user/requireAuth.js";
import { validateRequest } from "../../middlewares/user/validateRequest.js";
import { payePitSchemaValidator } from "../../middlewares/validation/tax/payePit.validator.js";
import { calculatePayePitPublic } from "../../controllers/tax/payePit/payePit.public.controller.js";
import { calculatePayePitAuth } from "../../controllers/tax/payePit/payePit.auth.controller.js";

const router = express.Router();

// ===================== PUBLIC =====================
router.post(
	"/calculate",
	validateRequest(payePitSchemaValidator),
	calculatePayePitPublic,
);

// ===================== PRIVATE =====================
router.post(
	"/calculate/save",
	requireAuth,
	validateRequest(payePitSchemaValidator),
	calculatePayePitAuth,
);

export default router;

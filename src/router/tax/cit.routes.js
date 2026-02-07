// src/routes/tax/cit.routes.js
// =========================

import express from "express";
import { requireAuth } from "../../middlewares/user/requireAuth.js";
import { validateRequest } from "../../middlewares/user/validateRequest.js";
import { citSchemaValidator } from "../../middlewares/validation/tax/cit.validator.js";
import { calculateCitPublic } from "../../controllers/tax/cit/cit.public.controller.js";
import { calculateCitAuth } from "../../controllers/tax/cit/cit.auth.controller.js";

const router = express.Router();

// ================= PUBLIC =================
router.post(
	"/calculate",
	validateRequest(citSchemaValidator),
	calculateCitPublic,
);

// ================= AUTH =================
router.post(
	"/calculate/save",
	requireAuth,
	validateRequest(citSchemaValidator),
	calculateCitAuth,
);

export default router;

// src/routes/tax/freelancer.routes.js

// =========================
import express from "express";
import { requireAuth } from "../../middlewares/user/requireAuth.js";
import { validateRequest } from "../../middlewares/user/validateRequest.js";
import { freelancerSchemaValidator } from "../../middlewares/validation/tax/freelancer.validator.js";
import { calculateFreelancerPublic } from "../../controllers/tax/freelancer/freelancer.public.controller.js";
import { calculateFreelancerAuth } from "../../controllers/tax/freelancer/freelancer.auth.controller.js";

const router = express.Router();

// ===================== PUBLIC =====================
router.post(
	"/calculate",
	validateRequest(freelancerSchemaValidator),
	calculateFreelancerPublic,
);

// ===================== PRIVATE =====================
router.post(
	"/calculate/save",
	requireAuth,
	validateRequest(freelancerSchemaValidator),
	calculateFreelancerAuth,
);

export default router;

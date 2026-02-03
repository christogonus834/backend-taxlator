// src/routes/tax/tax.routes.js
// =========================

import express from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { validate } from "../../middlewares/tax/validateRequest.js";

import { payePitSchema } from "../../middlewares/tax/payePit.validator.js";
import { freelancerSchema } from "../../middlewares/tax/freelancer.validator.js";
import { citSchema } from "../../middlewares/tax/cit.validator.js";

import { calculatePayePitTax } from "../../controllers/tax/payePit.controller.js";
import { calculateFreelancer } from "../../controllers/tax/freelancer.controller.js";
import { calculateCit } from "../../controllers/tax/cit.controller.js";

const router = express.Router();

// ===================== TAX ROUTES =====================

router.post(
	"/paye-pit",
	requireAuth,
	validate(payePitSchema),
	calculatePayePitTax,
);

router.post(
	"/freelancer",
	requireAuth,
	validate(freelancerSchema),
	calculateFreelancer,
);

router.post("/cit", requireAuth, validate(citSchema), calculateCit);

export default router;

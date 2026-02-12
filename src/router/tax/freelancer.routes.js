// src/routes/tax/freelancer.routes.js

// =========================
import express from "express";
import { requireAuth } from "../../middlewares/user/requireAuth.js";
import { validateRequest } from "../../middlewares/user/validateRequest.js";
import { freelancerSchemaValidator } from "../../middlewares/validation/tax/freelancer.validator.js";
import { calculateFreelancerPublic } from "../../controllers/tax/freelancer/freelancer.public.controller.js";
import { calculateFreelancerAuth } from "../../controllers/tax/freelancer/freelancer.auth.controller.js";
import { requestLogger } from "../../middlewares/dev/requestLogger.js";

const freelancerRouter = express.Router();

// =========================
// Module-level request logging
// All requests to this router will log with "FREELANCER" prefix
freelancerRouter.use(requestLogger("FREELANCER"));

// ===================== PUBLIC =====================
freelancerRouter.post(
	"/calculate",
	validateRequest(freelancerSchemaValidator),
	calculateFreelancerPublic,
);

// ===================== PRIVATE =====================
freelancerRouter.post(
	"/calculate/save",
	requireAuth,
	validateRequest(freelancerSchemaValidator),
	calculateFreelancerAuth,
);

export default freelancerRouter;

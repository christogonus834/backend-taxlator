// ==============================
// src/tax/freelancer/freelancer.routes.js
// ==============================

// =========================
import express from "express";
import { requireAuth } from "../../shared/requireAuth.js";
import { validateRequest } from "../../shared/middleware/validators/validateRequest.js";
import { freelancerSchemaValidator } from "../freelancer/freelancer.validator.js";
import { calculateFreelancerPublic } from "./freelancer.public.controller.js";
import { calculateFreelancerAuth } from "./freelancer.auth.controller.js";
import { requestLogger } from "../../shared/middleware/dev/requestLogger.js";
// ==============================

// ==============================
const freelancerRouter = express.Router();
// ==============================

// ==============================
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
// ==============================

export default freelancerRouter;

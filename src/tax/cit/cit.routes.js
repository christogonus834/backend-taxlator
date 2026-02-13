// ==============================
// src/tax/cit/cit.routes.js
// ==============================

// ==============================
import express from "express";
import { requireAuth } from "../../shared/requireAuth.js";
import { validateRequest } from "../../shared/middleware/validators/validateRequest.js";
import { citSchemaValidator } from "./cit.validator.js";
import { calculateCitPublic } from "./cit.public.controller.js";
import { calculateCitAuth } from "./cit.auth.controller.js";
import { requestLogger } from "../../shared/middleware/dev/requestLogger.js";
// ==============================

// ==============================
const citRouter = express.Router();
// ==============================

// ==============================
// Module-level request logging
// All requests to this router will log with "CIT" prefix
citRouter.use(requestLogger("CIT"));

// ================= PUBLIC =================
citRouter.post(
	"/calculate",
	validateRequest(citSchemaValidator),
	calculateCitPublic,
);

// ================= AUTH =================
citRouter.post(
	"/calculate/save",
	requireAuth,
	validateRequest(citSchemaValidator),
	calculateCitAuth,
);
// ==============================

export default citRouter;

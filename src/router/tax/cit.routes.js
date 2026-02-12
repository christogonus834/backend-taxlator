// src/routes/tax/cit.routes.js
// =========================

import express from "express";
import { requireAuth } from "../../middlewares/user/requireAuth.js";
import { validateRequest } from "../../middlewares/user/validateRequest.js";
import { citSchemaValidator } from "../../middlewares/validation/tax/cit.validator.js";
import { calculateCitPublic } from "../../controllers/tax/cit/cit.public.controller.js";
import { calculateCitAuth } from "../../controllers/tax/cit/cit.auth.controller.js";
import { requestLogger } from "../../middlewares/dev/requestLogger.js";

const citRouter = express.Router();

// =========================
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

export default citRouter;

// ==============================
// src/tax/payePit/payePit.routes.js
// ==============================

// =========================
import express from "express";
import { requireAuth } from "../../shared/requireAuth.js";
import { validateRequest } from "../../shared/middleware/validators/validateRequest.js";
import { payePitSchemaValidator } from "./payePit.validator.js";
import { calculatePayePitPublic } from "./payePit.public.controller.js";
import { calculatePayePitAuth } from "./payePit.auth.controller.js";
import { requestLogger } from "../../shared/middleware/dev/requestLogger.js";
// ==============================

// ==============================
const payePitRouter = express.Router();
// ==============================

// ==============================
// Module-level request logging
// All requests to this router will log with "PAYE/PIT" prefix
payePitRouter.use(requestLogger("PAYE/PIT"));

// ===================== PUBLIC =====================
payePitRouter.post(
	"/calculate",
	validateRequest(payePitSchemaValidator),
	calculatePayePitPublic,
);

// ===================== PRIVATE =====================
payePitRouter.post(
	"/calculate/save",
	requireAuth,
	validateRequest(payePitSchemaValidator),
	calculatePayePitAuth,
);
// ==============================

export default payePitRouter;

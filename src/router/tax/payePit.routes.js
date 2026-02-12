// src/routers/tax/payePit.routes.js

// =========================
import express from "express";
import { requireAuth } from "../../middlewares/user/requireAuth.js";
import { validateRequest } from "../../middlewares/user/validateRequest.js";
import { payePitSchemaValidator } from "../../middlewares/validation/tax/payePit.validator.js";
import { calculatePayePitPublic } from "../../controllers/tax/payePit/payePit.public.controller.js";
import { calculatePayePitAuth } from "../../controllers/tax/payePit/payePit.auth.controller.js";
import { requestLogger } from "../../middlewares/dev/requestLogger.js";

const payePitRouter = express.Router();

// =========================
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

export default payePitRouter;

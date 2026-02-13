// ==============================
// src/vat/vat.routes.js
// ==============================

// ========================
import express from "express";
import { requireAuth } from "../shared/requireAuth.js";
import { validateRequest } from "../shared/middleware/validators/validateRequest.js";
import { vatSchemaValidator } from "../vat/vatValidator.js";
import { calculateVatPublic } from "./vat.public.controller.js";
import { calculateVatAuth } from "./vat.auth.controller.js";
import { requestLogger } from "../shared/middleware/dev/requestLogger.js";
// ==============================

// ==============================
const vatRouter = express.Router();
// ==============================

// =========================
// Module-level request logging
// All requests to this router will log with "VAT" prefix
vatRouter.use(requestLogger("VAT"));

// ===================== PUBLIC =====================
vatRouter.post(
	"/calculate",
	validateRequest(vatSchemaValidator),
	calculateVatPublic,
);

// ===================== PRIVATE =====================
vatRouter.post(
	"/calculate/save",
	requireAuth,
	validateRequest(vatSchemaValidator),
	calculateVatAuth,
);
// ==============================

export default vatRouter;

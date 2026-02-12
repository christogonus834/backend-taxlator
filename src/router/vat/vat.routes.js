// src/routers/vat/vat.routes.js

// ========================
import express from "express";
import { requireAuth } from "../../middlewares/user/requireAuth.js";
import { validateRequest } from "../../middlewares/user/validateRequest.js";
import { vatSchemaValidator } from "../../middlewares/validation/vat/vatValidator.js";
import {
	calculateVatPublic,
	calculateVatAuth,
} from "../../controllers/vat/index.js";
import { requestLogger } from "../../middlewares/dev/requestLogger.js";


const vatRouter = express.Router();

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

export default vatRouter;

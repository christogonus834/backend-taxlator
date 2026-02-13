// ==============================
// src/tax/cit/cit.routes.js
// ==============================

// ==============================
import express from "express";
import { requireAuth } from "../../shared/requireAuth.js";
import { validateRequest } from "../../shared/middleware/validators/validateRequest.js";
import cit from "./cit.model.js";
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
citRouter.post("/calculate", validateRequest(cit), calculateCitPublic);

// ================= AUTH =================
citRouter.post(
	"/calculate/save",
	requireAuth,
	validateRequest(cit),
	calculateCitAuth,
);
// ==============================

export default citRouter;

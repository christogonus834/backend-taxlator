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

const router = express.Router();

// ===================== PUBLIC =====================
router.post(
	"/calculate",
	validateRequest(vatSchemaValidator),
	calculateVatPublic,
);

// ===================== PRIVATE =====================
router.post(
	"/calculate/save",
	requireAuth,
	validateRequest(vatSchemaValidator),
	calculateVatAuth,
);

export default router;

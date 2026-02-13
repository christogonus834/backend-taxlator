// ==========================
// src/history/history.routes.js
// ==========================

import express from "express";
import { protect } from "../auth/authMiddleware.js";
import {
	getHistory,
	clearHistory,
	exportCSV,
	exportPDF,
} from "../history/history.controller.js";
// ==========================

// ========================= HISTORY ROUTES =========================
const historyRouter = express.Router();
// =========================

historyRouter.get("/", protect, getHistory);
historyRouter.delete("/", protect, clearHistory);
historyRouter.get("/export/csv", protect, exportCSV);
historyRouter.get("/export/pdf", protect, exportPDF);
// =========================

export default historyRouter;

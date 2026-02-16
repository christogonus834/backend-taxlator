// ==========================
// src/history/history.routes.js
// ==========================

// ==========================
import express from "express";
import { protect } from "../auth/authMiddleware.js";
import {
	getHistory,
	createHistory,
	clearHistory,
	exportCSV,
	exportPDF,
} from "../history/history.controller.js";
// ==========================

// ========================== HISTORY ROUTES ==========================
const historyRouter = express.Router();

// ========================== GET user history ==========================
historyRouter.get("/", protect, getHistory);

// ========================== ADD to history ==========================
historyRouter.post("/", protect, createHistory);

// ========================== DELETE user history ==========================
historyRouter.delete("/", protect, clearHistory);

// ========================== EXPORT CSV ==========================
historyRouter.get("/export/csv", protect, exportCSV);

// ========================== EXPORT PDF ==========================
historyRouter.get("/export/pdf", protect, exportPDF);
// ==========================

export default historyRouter;

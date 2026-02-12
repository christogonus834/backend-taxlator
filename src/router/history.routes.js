// src/router/history.routes.js

// =========================
import express from "express";
import History from "../models/history.model.js";
import { protect } from "../middlewares/auth/authMiddleware.js";
import { exportCSV, exportPDF } from "../controllers/history.controller.js";
import { requestLogger } from "../../middlewares/dev/requestLogger.js";

const historyRouter = express.Router();

// =========================
// Module-level request logging
// All requests to this router will log with "HISTORY" prefix
historyRouter.use(requestLogger("HISTORY"));

/* ================= EXPORT ================= */
historyRouter.get("/export/csv", protect, exportCSV);
historyRouter.get("/export/pdf", protect, exportPDF);

/* ================= GET USER HISTORY ================= */
historyRouter.get("/", protect, async (req, res) => {
	try {
		const userId = req.user._id;
		const limit = Math.min(Number(req.query.limit) || 10, 50);
		const cursor = req.query.cursor;

		const query = { userId };
		if (cursor) query.createdAt = { $lt: new Date(cursor) };

		const items = await History.find(query)
			.sort({ createdAt: -1 })
			.limit(limit + 1);

		const hasNext = items.length > limit;
		const sliced = hasNext ? items.slice(0, limit) : items;
		const nextCursor = hasNext ? sliced[sliced.length - 1].createdAt : null;

		res.json({ items: sliced, nextCursor });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to fetch history" });
	}
});

/* ================= ADD HISTORY ================= */
historyRouter.post("/", protect, async (req, res) => {
	try {
		const { type, input, result } = req.body;

		const item = await History.create({
			userId: req.user._id,
			type,
			input,
			result,
		});

		res.json(item);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to save history" });
	}
});

/* ================= CLEAR HISTORY ================= */
historyRouter.delete("/", protect, async (req, res) => {
	try {
		await History.deleteMany({ userId: req.user._id });
		res.json({ message: "History cleared" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to clear history" });
	}
});

export default historyRouter;

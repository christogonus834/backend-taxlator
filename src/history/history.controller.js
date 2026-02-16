// ==============================
// src/history/history.controller.js
// ==============================

import History from "../history/history.model.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import { formatHistoryForCsv } from "../utils/formatForCsv.js";
import { buildHistoryPdf } from "../utils/buildPdf.js";

// ============================== GET USER HISTORY ==============================
export const getHistory = async (req, res) => {
	try {
		const limit = Math.min(Number(req.query.limit) || 10, 50);
		const cursor = req.query.cursor;

		console.log("🌐 getHistory called", {
			userId: req.user?._id,
			limit,
			cursor,
		});

		const query = { userId: req.user._id };
		if (cursor) query.createdAt = { $lt: new Date(cursor) };

		const items = await History.find(query)
			.sort({ createdAt: -1 })
			.limit(limit + 1)
			.lean();

		const hasNext = items.length > limit;
		const sliced = hasNext ? items.slice(0, limit) : items;

		console.log("✅ getHistory returning items:", sliced.length);

		res.json({
			items: sliced,
			nextCursor: hasNext ? sliced[sliced.length - 1].createdAt : null,
		});
	} catch (err) {
		console.error("❌ Error fetching history:", err);
		res.status(500).json({ message: "Failed to fetch history" });
	}
};

// ============================== CREATE HISTORY ITEM ==========================
export const createHistory = async (req, res) => {
	try {
		const { type, input, result } = req.body;

		console.log("🌐 createHistory called", {
			userId: req.user?._id,
			type,
			input,
			result,
		});

		if (!type || !input || !result) {
			console.log("⚠️ Missing required fields in history");
			return res.status(400).json({ message: "Missing required fields" });
		}

		const newItem = await History.create({
			userId: req.user._id,
			type,
			input,
			result,
		});

		console.log("✅ History item created:", newItem._id);
		res.status(201).json(newItem);
	} catch (err) {
		console.error("❌ Failed to create history item:", err);
		res.status(500).json({ message: "Failed to create history item" });
	}
};

// ============================== EXPORT CSV ==============================
export const exportCSV = async (req, res) => {
	try {
		console.log("🌐 exportCSV called", { userId: req.user?._id });

		const items = await History.find({ userId: req.user._id })
			.sort({ createdAt: -1 })
			.lean();

		const formatted = formatHistoryForCsv(items);

		const parser = new Parser();
		const csv = parser.parse(formatted);

		res.header("Content-Type", "text/csv");
		res.attachment("taxlator-history.csv");
		res.send(csv);

		console.log("✅ exportCSV completed, rows:", items.length);
	} catch (err) {
		console.error("❌ Failed to export CSV:", err);
		res.status(500).json({ message: "Failed to export CSV" });
	}
};

// ============================== EXPORT PDF ==============================
export const exportPDF = async (req, res) => {
	try {
		console.log("🌐 exportPDF called", { userId: req.user?._id });

		const items = await History.find({ userId: req.user._id })
			.sort({ createdAt: -1 })
			.lean();

		const doc = new PDFDocument({ margin: 40 });

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=taxlator-report.pdf",
		);

		doc.pipe(res);
		buildHistoryPdf(doc, items);
		doc.end();

		console.log("✅ exportPDF completed, rows:", items.length);
	} catch (err) {
		console.error("❌ Failed to export PDF:", err);
		res.status(500).json({ message: "Failed to export PDF" });
	}
};

// ============================== CLEAR HISTORY ==============================
export const clearHistory = async (req, res) => {
	try {
		console.log("🌐 clearHistory called", { userId: req.user?._id });

		const result = await History.deleteMany({ userId: req.user._id });

		console.log("✅ History cleared, deletedCount:", result.deletedCount);
		res.json({ success: true });
	} catch (err) {
		console.error("❌ Failed to clear history:", err);
		res.status(500).json({ message: "Failed to clear history" });
	}
};

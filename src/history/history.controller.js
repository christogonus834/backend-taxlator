// =========================
// src/controllers/history/history.controller.js
// =========================

import History from "../history/history.model.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
// ==========================

/* ================= GET USER HISTORY ================= */
export const getHistory = async (req, res) => {
	try {
		const limit = Math.min(Number(req.query.limit) || 10, 50);
		const cursor = req.query.cursor;

		const query = { userId: req.user._id };
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
};

/* ================= CLEAR HISTORY ================= */
export const clearHistory = async (req, res) => {
	try {
		await History.deleteMany({ userId: req.user._id });
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ message: "Failed to clear history" });
	}
};

/* ================= EXPORT CSV ================= */
export const exportCSV = async (req, res) => {
	const items = await History.find({ userId: req.user._id }).sort({
		createdAt: -1,
	});

	const parser = new Parser();
	const csv = parser.parse(items);

	res.header("Content-Type", "text/csv");
	res.attachment("history.csv");
	res.send(csv);
};

/* ================= EXPORT PDF ================= */
export const exportPDF = async (req, res) => {
	const items = await History.find({ userId: req.user._id }).sort({
		createdAt: -1,
	});

	const doc = new PDFDocument();
	res.setHeader("Content-Type", "application/pdf");
	res.setHeader("Content-Disposition", 'attachment; filename="history.pdf"');

	doc.pipe(res);
	doc.fontSize(18).text("Taxlator History", { underline: true });
	doc.moveDown();

	items.forEach((item) => {
		doc.fontSize(11).text(`${item.type} — ${item.createdAt.toISOString()}`);
		doc.text(`Input: ${JSON.stringify(item.input)}`);
		doc.text(`Result: ${JSON.stringify(item.result)}`);
		doc.moveDown();
	});

	doc.end();
};

// =========================
// src/controllers/history/history.controller.js
// =========================

// =========================
import History from "../history/history.model.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import { formatHistoryForCsv } from "../../utils/history/formatForCsv.js";
import { buildHistoryPdf } from "../../utils/history/buildPdf.js";
// =========================

/* ================= GET USER HISTORY ================= */
export const getHistory = async (req, res) => {
	try {
		const limit = Math.min(Number(req.query.limit) || 10, 50);
		const cursor = req.query.cursor;

		const query = { userId: req.user._id };
		if (cursor) query.createdAt = { $lt: new Date(cursor) };

		const items = await History.find(query)
			.sort({ createdAt: -1 })
			.limit(limit + 1)
			.lean();

		const hasNext = items.length > limit;
		const sliced = hasNext ? items.slice(0, limit) : items;

		res.json({
			items: sliced,
			nextCursor: hasNext ? sliced[sliced.length - 1].createdAt : null,
		});
	} catch (err) {
		res.status(500).json({ message: "Failed to fetch history" });
	}
};

/* ================= EXPORT CSV ================= */
export const exportCSV = async (req, res) => {
	const items = await History.find({ userId: req.user._id })
		.sort({
			createdAt: -1,
		})
		.lean();

	const formatted = formatHistoryForCsv(items);

	const parser = new Parser();
	const csv = parser.parse(formatted);

	res.header("Content-Type", "text/csv");
	res.attachment("taxlator-history.csv");
	res.send(csv);
};

/* ================= EXPORT PDF ================= */
export const exportPDF = async (req, res) => {
	const items = await History.find({ userId: req.user._id })
		.sort({
			createdAt: -1,
		})
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
};

/* ================= CLEAR HISTORY ================= */
export const clearHistory = async (req, res) => {
	await History.deleteMany({ userId: req.user._id });
	res.json({ success: true });
};

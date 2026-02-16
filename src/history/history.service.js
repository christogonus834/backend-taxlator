// ==============================
// src/history/history.service.js
// ==============================

// ==============================
import History from "./history.model.js";
// ==============================

/* ============================== LOG HISTORY ============================== */
export async function logHistory({ userId, type, input, result }) {
	if (!userId) return;

	try {
		return await History.create({
			userId,
			type,
			input,
			result,
		});
	} catch (err) {
		console.error("Failed to log history:", err);
		throw err;
	}
}

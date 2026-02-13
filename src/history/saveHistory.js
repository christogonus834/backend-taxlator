// =========================
// src/history/saveHistory.js
// =========================

import History from "../history/history.model.js";
// =========================

// ========================= SAVE HISTORY =========================
export async function saveHistory({ userId, type, input, result }) {
	if (!userId) return;

	try {
		await History.create({
			userId,
			type,
			input,
			result,
		});
	} catch (err) {
		console.error("History save failed:", err);
	}
}

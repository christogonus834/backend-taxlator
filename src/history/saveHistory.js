// ==============================
// src/history/saveHistory.js
// ==============================

// ==============================
import { logHistory } from "./history.service.js";
// ==============================

/* ========================= SAVE HISTORY (LEGACY WRAPPER) ========================= */
export async function saveHistory({ userId, type, input, result }) {
	if (!userId) return;

	try {
		await logHistory({ userId, type, input, result }); // ✅ userId
	} catch (err) {
		console.error("History save failed:", err);
	}
}

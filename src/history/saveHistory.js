// =========================
// src/history/saveHistory.js
// =========================

import { logHistory } from "./history.service.js";
// =========================

// ========================= SAVE HISTORY (LEGACY WRAPPER) =========================
export async function saveHistory({ userId, type, input, result }) {
	try {
		await logHistory({ userId, type, input, result });
	} catch (err) {
		console.error("History save failed:", err);
	}
}

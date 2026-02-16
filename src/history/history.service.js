// ==============================
// src/history/history.service.js
// ==============================

// ==============================
import History from "./history.model.js";
// ==============================

// ============================== LOG HISTORY ==============================
export async function logHistory({ userId, type, input, result }) {
	if (!userId) return;

	return History.create({
		userId,
		type,
		input,
		result,
	});
}

// ==============================
// src/history/history.service.js
// ==============================

// ==============================
import History from "./history.model.js";
// ==============================

// ==============================
export async function logHistory({ userId, type, input, result, recordId }) {
	return History.create({
		userId,
		type,
		input,
		result,
		recordId,
	});
}

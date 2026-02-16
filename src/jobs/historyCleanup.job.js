// =========================
// src/jobs/historyCleanup.job.js
// =========================

// =========================
import History from "../history/history.model.js";
// =========================

// ========================= OLD HISTORY CLEAN UP =========================
export const cleanupOldHistory = async () => {
	const months = Number(process.env.HISTORY_RETENTION_MONTHS || 6);

	const cutoff = new Date();
	cutoff.setMonth(cutoff.getMonth() - months);

	await History.deleteMany({
		createdAt: { $lt: cutoff },
	});

	console.log(`History cleanup complete (>${months} months removed)`);
};

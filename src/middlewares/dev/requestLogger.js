// src/middlewares/dev/requestLogger.js

// =========================
// Logs requests ONLY in development.
// Keeps Render production logs clean.

import env from "../../config/env.js";

// ========================= REQUEST LOGGER =========================
export const requestLogger = (label) => {
	return (req, res, next) => {
		// ✅ Do nothing outside development
		if (env.nodeEnv !== "development") return next();

		const start = Date.now();

		console.log(`\n[${label}] ${req.method} ${req.originalUrl}`);

		// Optional: log body for non-GET requests
		if (req.method !== "GET" && req.body && Object.keys(req.body).length) {
			console.log(`[${label}] → Body:`, req.body);
		}

		res.on("finish", () => {
			const duration = Date.now() - start;
			console.log(
				`[${label}] ← ${res.statusCode} ${res.statusMessage || ""} (${duration}ms)`,
			);
		});

		next();
	};
};
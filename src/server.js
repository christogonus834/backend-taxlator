// =========================
// src/server.js
// =========================

// =========================
import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import { gracefulShutdown } from "./utils/gracefulShutdown.js";
import env from "./config/env.js";
import "./jobs/scheduler.job.js";
// =========================

// ========================= ENV CHECKS =========================
["mongoURI", "tokenSecret"].forEach((key) => {
	if (!env[key]) {
		console.error(`❌ Missing ${key} in environment variables`);
		process.exit(1);
	}
});

// ========================= GMAIL ENV CHECK =========================
const missingGmailVars = Object.entries(env.gmail)
	.filter(([, value]) => !value || value.trim() === "")
	.map(([key]) => key);

if (missingGmailVars.length) {
	console.warn(
		`⚠️ Gmail API env vars missing: ${missingGmailVars.join(", ")}. Email sending disabled.`,
	);
} else {
	console.log("✅ Gmail API env vars loaded successfully.");
}

// ========================= START SERVER =========================
const startServer = async () => {
	await connectDB();

	const server = app.listen(env.port, "0.0.0.0", () => {
		console.log(`🚀 Tax service running on port ${env.port}`);
	});

	gracefulShutdown(server);
};

startServer();

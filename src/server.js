// src/server.js
// =========================

// ========================= ENTRY POINT =========================
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { gracefulShutdown } from "./utils/other/gracefulShutdown.js";

dotenv.config();

const { PORT = 8000, MONGO_URI } = process.env;

// ========================= ENV VAR CHECKS =========================
["MONGO_URI", "TOKEN_SECRET"].forEach((key) => {
	if (!process.env[key]) {
		console.error(`❌ Missing ${key} in environment variables`);
		process.exit(1);
	}
});

const hasGmailEnv =
	!!process.env.GMAIL_CLIENT_ID &&
	!!process.env.GMAIL_CLIENT_SECRET &&
	!!process.env.GMAIL_REFRESH_TOKEN &&
	!!process.env.GMAIL_SENDER;

if (!hasGmailEnv) {
	console.warn(
		"⚠️ Gmail API env vars missing. Email sending will fail until configured.",
	);
}

// ========================= MONGODB CONNECTION =========================
mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log("✅ Successfully connected to MongoDB");

		const server = app.listen(PORT, "0.0.0.0", () => {
			console.log(`🚀 Tax service running on port ${PORT}`);
		});

		// ========================= GRACEFUL SHUTDOWN =========================
		gracefulShutdown(server);
	})
	.catch((err) => {
		console.error("❌ Error connecting to MongoDB:", err.message);
		process.exit(1);
	});

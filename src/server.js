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
console.log("MONGO_URI:", !!MONGO_URI);
console.log("TOKEN_SECRET:", !!process.env.TOKEN_SECRET);
console.log("GMAIL_CLIENT_ID:", !!process.env.GMAIL_CLIENT_ID);
console.log("GMAIL_CLIENT_SECRET:", !!process.env.GMAIL_CLIENT_SECRET);
console.log("GMAIL_REFRESH_TOKEN:", !!process.env.GMAIL_REFRESH_TOKEN);
console.log("GMAIL_SENDER:", !!process.env.GMAIL_SENDER);

if (!MONGO_URI) {
	console.error("❌ Missing MONGO_URI in environment variables");
	process.exit(1);
}

if (!process.env.TOKEN_SECRET) {
	console.error("❌ Missing TOKEN_SECRET in environment variables");
	process.exit(1);
}

// ========================= GMAIL CONFIG CHECK =========================)
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

let server;

// ========================= MONGODB CONNECTION =========================
mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log("✅ Successfully connected to MongoDB");

		server = app.listen(PORT, "0.0.0.0", () => {
			console.log(`🚀 Tax service running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("❌ Error connecting to MongoDB:", err.message);
		process.exit(1);
	});

// ========================= GRACEFUL SHUTDOWN =========================
gracefulShutdown(server);

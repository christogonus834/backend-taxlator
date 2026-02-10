// src/config/env.js

// =========================
import dotenv from "dotenv";

dotenv.config();

// ========================= ENVIRONMENT VARIABLES =========================
const env = {
	port: Number(process.env.PORT) || 8000,
	mongoURI: process.env.MONGO_URI,
	nodeEnv: process.env.NODE_ENV || "development",

	// ========================= GMAIL API CONFIG =========================
	gmail: {
		clientId: process.env.GMAIL_CLIENT_ID,
		clientSecret: process.env.GMAIL_CLIENT_SECRET,
		refreshToken: process.env.GMAIL_REFRESH_TOKEN,
		sender: process.env.GMAIL_SENDER,
	},

	tokenSecret: process.env.TOKEN_SECRET,
};

export default env;

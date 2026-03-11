// =========================
// src/config/env.js
// This file loads environment variables from a .env file and exports them as a single object for use throughout the application.
// It uses the dotenv package to read the .env file and makes it easy to access configuration settings like database URIs, API keys, and other secrets in a consistent way.
// By centralizing the configuration in this file, we can keep our code clean and avoid hardcoding sensitive information.
// Let's keep building this awesome app!  bro
// =========================

import dotenv from "dotenv";
// =========================
dotenv.config();
// =========================
// ========================= ENVIRONMENT VARIABLES =========================
const env = {
	port: Number(process.env.PORT) || 8000,
	mongoURI: process.env.MONGO_URI,
	nodeEnv: process.env.NODE_ENV || "development",
	CLIENT_URL: process.env.CLIENT_URL,
	// ========================= GMAIL API CONFIG =========================
	gmail: {
		clientId: process.env.GMAIL_CLIENT_ID,
		clientSecret: process.env.GMAIL_CLIENT_SECRET,
		refreshToken: process.env.GMAIL_REFRESH_TOKEN,
		sender: process.env.GMAIL_SENDER,
	},
	tokenSecret: process.env.TOKEN_SECRET,
	// ========================= CLOUDINARY CONFIG =========================
	cloudinary: {
		cloudName: process.env.CLOUDINARY_CLOUD_NAME,
		apiKey: process.env.CLOUDINARY_API_KEY,
		apiSecret: process.env.CLOUDINARY_API_SECRET,
	},
};
// =========================
export default env;
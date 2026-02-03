// src/config/env.js
// =========================

// This module loads environment variables from a .env file,
//  and exports them for use throughout the application.
// =========================

import dotenv from "dotenv";

dotenv.config();

export default {
	port: process.env.PORT || 8000,
	mongoURI: process.env.MONGO_URI,
	nodeEnv: process.env.NODE_ENV || "development",
};

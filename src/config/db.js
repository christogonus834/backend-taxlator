// src/config/db.js

// =========================
// MongoDB connection logic only
// =========================

import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
	try {
		await mongoose.connect(env.mongoURI);
		console.log("✅ MongoDB connected successfully");
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

export default connectDB;

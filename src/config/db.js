// src/config/db.js
// =========================

// This module establishes a connection to the MongoDB database
// using Mongoose. It exports a function that can be called to
// initiate the connection when the application starts.
// =========================

import mongoose from "mongoose";
import { mongoURI } from "./env.js";

const connectDB = async () => {
	try {
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ MongoDB connected successfully");
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

export default connectDB;

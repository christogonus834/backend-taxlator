// =========================
// src/models/history/history.model.js
// =========================

import mongoose from "mongoose";
// =========================

// ========================= HISTORY SCHEMA =========================
const historySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		type: {
			type: String,
			required: true,
		},
		input: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
		result: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
	},
	{ timestamps: true },
);

// =========================
export default mongoose.model("History", historySchema);

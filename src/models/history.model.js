// src/models/history.model.js

// =========================
import mongoose from "mongoose";

// ========================= HISTORY SCHEMA =========================
const historySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", 
			required: true,
		},
		type: {
			type: String,
			required: true, 
		},
		input: {
			type: Object, 
			required: true,
		},
		result: {
			type: Object, 
			required: true,
		},
	},
	{ timestamps: true },
);

const History = mongoose.model("History", historySchema);

export default History;

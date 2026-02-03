// src/models/user/authCodes.js
// ============================================================

import mongoose from "mongoose";

// ===================== AUTH CODES MODEL =====================
const authCodesSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		verificationCode: {
			type: String,
		},
		verificationExpires: {
			type: Date,
		},
		forgotPasswordCode: {
			type: String,
			select: false,
		},
		forgotPasswordCodeValidation: {
			type: Number,
			select: false,
		},
	},
	{ timestamps: true },
);

// Optional: automatically delete expired verification/forgot codes
authCodesSchema.index(
	{ verificationExpires: 1 },
	{ expireAfterSeconds: 0 }, // TTL index
);

export default mongoose.model("AuthCodes", authCodesSchema);

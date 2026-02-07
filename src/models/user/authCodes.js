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
			required: true,
		},
		verificationExpires: {
			type: Date,
			required: true,
		},
		verificationAttempts: {
			type: Number,
			default: 0,
		},
		forgotPasswordCode: {
			type: String,
			select: false,
		},
		forgotPasswordExpires: {
			type: Date,
			select: false,
		},
		forgotPasswordCodeValidation: {
			type: Number,
			default: 0,
			select: false,
		},
	},
	{ timestamps: true },
);

authCodesSchema.index({ verificationExpires: 1 }, { expireAfterSeconds: 0 });

authCodesSchema.index({ forgotPasswordExpires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("AuthCodes", authCodesSchema);

// ===========================/
// src/user/userProfile.model.js
// ===========================

import mongoose from "mongoose";
// ===========================

// ===================== PROFILE SETTINGS MODEL =====================
const profileSettingsSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		avatarUrl: {
			type: String,
			default: null,
		},
		language: {
			type: String,
			default: "English",
		},
		theme: {
			type: String,
			enum: ["Light", "Dark"],
			default: "Light",
		},
		notifications: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

const ProfileSettings = mongoose.model(
	"ProfileSettings",
	profileSettingsSchema,
);
// ===========================

export default ProfileSettings;

// ===========================/
// src/user/userProfile.model.js

// This file defines the Mongoose schema and model for user profile settings.
// Each user has a profile that can include an avatar image (stored on Cloudinary), language preference, theme, and notification settings.
// The schema includes fields for the Cloudinary URL and public ID of the avatar, which allows for easy updates and deletions of the avatar image.
// The model is exported for use in other parts of the application, such as controllers that handle profile updates and avatar uploads.
// Wagon, let's keep building this awesome app!  bro
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
		avatarPublicId: {
			type: String,    // Cloudinary public_id — used to delete old avatar
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
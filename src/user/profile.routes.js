// ===============================
// src/user/profile.routes.js
// This file defines the Express router for user profile-related endpoints.
// It includes routes for getting the user's profile, updating profile information, and uploading a new avatar.
// The routes are protected by authentication middleware to ensure only logged-in users can access them.
// The avatar upload route uses Multer middleware configured for Cloudinary to handle file uploads.
// Yoo can find the corresponding controller functions in userProfile.controller.js, which handle the business logic for each route.
// Wagon, let's keep building this awesome app!  bro
// ===============================

import express from "express";
import User from "../user/userAuth.model.js";
import { protect } from "../auth/authMiddleware.js";
import { uploadAvatarMiddleware } from "../config/cloudinary.js";
import { uploadAvatar } from "../user/userProfile.controller.js";

const profileRouter = express.Router();

/* ================= GET PROFILE ================= */
profileRouter.get("/", protect, async (req, res) => {
	const user = await User.findById(req.user._id).select(
		"firstName lastName email avatarUrl language theme notifications",
	);
	res.json(user);
});

/* ================= UPDATE PROFILE ================= */
profileRouter.put("/", protect, async (req, res) => {
	const { firstName, lastName, avatarUrl, language, theme, notifications } =
		req.body;
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			firstName,
			lastName,
			avatarUrl,
			language,
			theme,
			notifications,
		},
		{ new: true },
	).select("firstName lastName email avatarUrl language theme notifications");
	res.json(user);
});

/* ================= UPLOAD AVATAR ================= */
profileRouter.patch("/avatar", protect, uploadAvatarMiddleware, uploadAvatar);

// ===============================
export default profileRouter;
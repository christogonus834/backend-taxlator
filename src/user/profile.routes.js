// ===============================
// src/user/profile.routes.js
// ===============================

// ===============================
import express from "express";
import User from "../user/userAuth.model.js";
import { authMiddleware } from "../auth/authMiddleware.js";

const profileRouter = express.Router();

/* ================= GET PROFILE ================= */
profileRouter.get("/", authMiddleware, async (req, res) => {
	const user = await User.findById(req.user._id).select(
		"firstName lastName email avatarUrl language theme notifications",
	);
	res.json(user);
});

/* ================= UPDATE PROFILE ================= */
profileRouter.put("/", authMiddleware, async (req, res) => {
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
// ===============================

export default profileRouter;

// ===============================
// src/controllers/auth/user.controller.js
// ===============================

// ===============================
import User from "../user/userAuth.model.js";
import { doHash, doHashValidation } from "../utils/hashing.js";

// ================= GET CURRENT USER =================
export const me = async (req, res) => {
	return res.json({ success: true, user: req.user });
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;
	const user = await User.findById(req.user.id).select("+password");

	if (!(await doHashValidation(currentPassword, user.password)))
		return res
			.status(400)
			.json({ success: false, message: "Incorrect password" });

	user.password = await doHash(newPassword, 12);
	await user.save();

	return res.json({ success: true });
};

// ================= SIGNOUT =================
export const signout = async (req, res) => {
	// Clear cookie for dev and production
	res.clearCookie("Authorization", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	});

	return res.json({ success: true, message: "Signed out successfully" });
};

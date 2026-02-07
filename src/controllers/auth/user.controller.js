// src/controllers/auth/user.controller.js

// ===============================
import User from "../../models/user/userAuth.model.js";
import { doHash, doHashValidation } from "../../utils/user/hashing.js";

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
	res.clearCookie("Authorization");
	return res.json({ success: true });
};

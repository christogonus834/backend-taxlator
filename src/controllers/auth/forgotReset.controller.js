// src/controllers/auth/forgotReset.controller.js

// -------------------------------
import User from "../../models/user/userAuth.model.js";
import { doHash } from "../../utils/user/hashing.js";
import { sendGmail } from "../../services/auth/gmailApiMailer.js";

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	if (!email)
		return res.status(400).json({ success: false, message: "Email required" });

	const user = await User.findOne({ email: email.toLowerCase() });
	if (!user)
		return res.status(404).json({ success: false, message: "User not found" });

	// generate a 6-digit reset code
	const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
	user.resetCode = resetCode;
	user.resetExpires = Date.now() + 15 * 60 * 1000; 
	await user.save();

	await sendGmail({
		to: user.email,
		subject: "Password Reset Code",
		text: `Your password reset code is ${resetCode}`,
		html: `<p>Your password reset code is:</p><h2>${resetCode}</h2><p>It expires in 15 minutes.</p>`,
	});

	return res.json({ success: true, message: "Reset code sent to email" });
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
	const { email, code, newPassword } = req.body;
	if (!email || !code || !newPassword)
		return res
			.status(400)
			.json({ success: false, message: "All fields required" });

	const user = await User.findOne({ email: email.toLowerCase() }).select(
		"+resetCode +resetExpires",
	);
	if (!user || user.resetCode !== code || user.resetExpires < Date.now())
		return res
			.status(400)
			.json({ success: false, message: "Invalid or expired reset code" });

	user.password = await doHash(newPassword, 12);
	user.resetCode = undefined;
	user.resetExpires = undefined;
	await user.save();

	return res.json({ success: true, message: "Password reset successfully" });
};

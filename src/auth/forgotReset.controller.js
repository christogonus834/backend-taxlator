// ===============================
// src/auth/forgotReset.controller.js
// ===============================

// ===============================
import User from "../user/userAuth.model.js";
import { doHash } from "../utils/hashing.js";
import { sendGmail } from "../utils/gmailApiMailer.js";
import {
	forgotPasswordEmail,
	resetPasswordEmail,
} from "../utils/emailTemplates.js";
// ===============================

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	if (!email)
		return res.status(400).json({ success: false, message: "Email required" });

	const normalizedEmail = email.trim().toLowerCase();
	const user = await User.findOne({ email: normalizedEmail });

	if (!user)
		return res.status(404).json({ success: false, message: "User not found" });

	// Generate 6-digit reset code
	const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
	user.resetCode = resetCode;
	user.resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
	await user.save();

	// Send forgot password email
	const emailTemplate = forgotPasswordEmail({
		firstName: user.firstName,
		code: resetCode,
	});
	await sendGmail({
		to: user.email,
		...emailTemplate,
	});

	return res.json({
		success: true,
		message: "Password reset code sent to email",
	});
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
	const { email, code, newPassword } = req.body;
	if (!email || !code || !newPassword)
		return res
			.status(400)
			.json({ success: false, message: "All fields are required" });

	const normalizedEmail = email.trim().toLowerCase();
	const user = await User.findOne({ email: normalizedEmail }).select(
		"+resetCode +resetExpires",
	);

	if (!user || user.resetCode !== code || user.resetExpires < Date.now())
		return res
			.status(400)
			.json({ success: false, message: "Invalid or expired reset code" });

	// Update password
	user.password = await doHash(newPassword, 12);
	user.resetCode = undefined;
	user.resetExpires = undefined;
	await user.save();

	// Send reset confirmation email
	const emailTemplate = resetPasswordEmail({ firstName: user.firstName });
	await sendGmail({
		to: user.email,
		...emailTemplate,
	});

	return res.json({
		success: true,
		message: "Password reset successfully",
	});
};

// src/controllers/auth/verify.controller.js

// ===========================================
import User from "../../models/user/userAuth.model.js";
import AuthCodes from "../../models/user/authCodes.js";
import { sendGmail } from "../../services/auth/gmailApiMailer.js";
import { welcomeEmail } from "../../services/auth/emailTemplates.js";

// ========================== VERIFY EMAIL CONTROLLER =========================
export const verifyEmail = async (req, res) => {
	const { email, code } = req.body;

	try {
		if (!email || !code) {
			return res.status(400).json({
				success: false,
				message: "Email and code are required",
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await User.findOne({ email: normalizedEmail });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		if (user.verified) {
			return res.status(400).json({
				success: false,
				message: "Email already verified",
			});
		}

		const authCode = await AuthCodes.findOne({ userId: user._id });

		if (
			!authCode ||
			authCode.verificationCode !== code ||
			authCode.verificationExpires < Date.now()
		) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired code",
			});
		}

		// ========================== VERIFY USER ========================
		user.verified = true;
		await user.save();

		// ========================== CLEANUP CODE ========================
		await AuthCodes.deleteOne({ userId: user._id });

		// ========================== WELCOME EMAIL ========================
		const emailTemplate = welcomeEmail({ firstName: user.firstName });

		await sendGmail({
			to: user.email,
			...emailTemplate,
		});

		return res.json({
			success: true,
			message: "Email verified successfully",
		});
	} catch (err) {
		console.error("Verify email error:", err);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

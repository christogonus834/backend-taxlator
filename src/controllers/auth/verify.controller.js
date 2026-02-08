// src/controllers/auth/verify.controller.js

// ===============================
import User from "../../models/user/userAuth.model.js";
import { sendGmail } from "../../services/auth/gmailApiMailer.js";
import { welcomeEmail } from "../../services/auth/emailTemplates.js";
import { resendVerificationEmail } from "../../services/auth/emailTemplates.js";

// ================= VERIFY EMAIL =================
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

		const user = await User.findOne({ email: normalizedEmail }).select(
			"+verificationCode +verificationExpires",
		);

		if (
			!user ||
			user.verified ||
			user.verificationCode !== code ||
			user.verificationExpires < Date.now()
		) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid or expired code" });
		}

		// ---------------- VERIFY USER ----------------
		user.verified = true;
		user.verificationCode = undefined;
		user.verificationExpires = undefined;
		await user.save();

		// ---------------- SEND WELCOME EMAIL ----------------
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

// ================= RESEND VERIFICATION CODE =================
export const sendVerificationCode = async (req, res) => {
	const { email } = req.body;

	try {
		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const normalizedEmail = email.trim().toLowerCase();
		const user = await User.findOne({ email: normalizedEmail });

		if (!user || user.verified) {
			return res.status(400).json({
				success: false,
				message: "Invalid user",
			});
		}

		const code = Math.floor(100000 + Math.random() * 900000).toString();

		user.verificationCode = code;
		user.verificationExpires = Date.now() + 15 * 60 * 1000;
		await user.save();

		const emailTemplate = resendVerificationEmail({
			firstName: user.firstName,
			code,
		});

		await sendGmail({
			to: user.email,
			...emailTemplate,
		});

		return res.json({
			success: true,
			message: "Verification code sent",
		});
	} catch (err) {
		console.error("Send verification code error:", err);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// src/controllers/auth/verify.controller.js

// ===============================
import User from "../../models/user/userAuth.model.js";
import { sendGmail } from "../../services/auth/gmailApiMailer.js";

// ================= VERIFY EMAIL =================
export const verifyEmail = async (req, res) => {
	const { email, code } = req.body;

	const user = await User.findOne({ email: email.toLowerCase() }).select(
		"+verificationCode +verificationExpires",
	);

	if (
		!user ||
		user.verified ||
		user.verificationCode !== code ||
		user.verificationExpires < Date.now()
	)
		return res
			.status(400)
			.json({ success: false, message: "Invalid or expired code" });

	user.verified = true;
	user.verificationCode = undefined;
	user.verificationExpires = undefined;
	await user.save();

	return res.json({ success: true });
};

// ================= RESEND VERIFICATION CODE =================
export const sendVerificationCode = async (req, res) => {
	const { email } = req.body;
	if (!email)
		return res
			.status(400)
			.json({ success: false, message: "Email is required" });

	const normalizedEmail = email.trim().toLowerCase();
	const user = await User.findOne({ email: normalizedEmail });
	if (!user || user.verified)
		return res.status(400).json({ success: false, message: "Invalid user" });

	const code = Math.floor(100000 + Math.random() * 900000).toString();
	user.verificationCode = code;
	user.verificationExpires = Date.now() + 15 * 60 * 1000;
	await user.save();

	await sendGmail({
		to: user.email,
		subject: "Verification Code",
		text: `Your verification code is ${code}`,
		html: `<p>Your verification code is:</p><h2>${code}</h2><p>This code expires in 15 minutes.</p>`,
	});

	return res.json({ success: true });
};

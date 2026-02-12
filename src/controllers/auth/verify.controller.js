// src/controllers/auth/verify.controller.js

// ===========================================
import jwt from "jsonwebtoken";
import User from "../../models/user/userAuth.model.js";
import AuthCodes from "../../models/user/authCodes.js";
import { sendGmail } from "../../services/auth/gmailApiMailer.js";
import { welcomeEmail } from "../../services/auth/emailTemplates.js";
import { AppError } from "../../errors/AppError.js";

// ========================== VERIFY EMAIL & AUTO SIGN-IN ==========================
export async function verifyEmail(req, res, next) {
	try {
		const { email, code } = req.body;

		if (!email || !code) {
			throw new AppError("Email and code are required", 400);
		}

		const normalizedEmail = email.trim().toLowerCase();
		const user = await User.findOne({ email: normalizedEmail });
		if (!user) throw new AppError("User not found", 404);
		if (user.verified) throw new AppError("Email already verified", 400);

		const authCode = await AuthCodes.findOne({ userId: user._id });
		if (
			!authCode ||
			authCode.verificationCode !== code ||
			authCode.verificationExpires < Date.now()
		) {
			throw new AppError("Invalid or expired code", 400);
		}

		// ========================== MARK USER AS VERIFIED ========================
		user.verified = true;
		await user.save();

		// ========================== DELETE USED CODE ============================
		await AuthCodes.deleteOne({ userId: user._id });

		// ==================== SEND WELCOME EMAIL ================================
		const emailTemplate = welcomeEmail({ firstName: user.firstName });
		await sendGmail({ to: user.email, ...emailTemplate });

		// ==================== CREATE JWT TOKEN ================================
		if (!process.env.TOKEN_SECRET)
			throw new Error("TOKEN_SECRET missing in environment");
		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.TOKEN_SECRET,
			{ expiresIn: "1h" },
		);

		// ==================== SET TOKEN AS HTTPONLY COOKIE =====================
		// This allows frontend to automatically consider user as signed-in
		res.cookie("Authorization", `Bearer ${token}`, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 1000, // 1 hour
		});

		// ==================== RESPOND TO FRONTEND ==============================
		return res.status(200).json({
			success: true,
			message:
				"Email verified successfully. Welcome email sent. You are now signed in.",
		});
	} catch (error) {
		next(error);
	}
}

// src/controllers/auth/verify.controller.js

// ===========================================
import User from "../../models/user/userAuth.model.js";
import AuthCodes from "../../models/user/authCodes.js";
import { sendGmail } from "../../services/auth/gmailApiMailer.js";
import {
	verificationEmail,
	welcomeEmail,
} from "../../services/auth/emailTemplates.js";
import { AppError } from "../../errors/AppError.js";

// ===================== SEND VERIFICATION CODE =====================
export async function sendVerificationCode(req, res, next) {
	try {
		const { email } = req.body;

		if (!email) {
			throw new AppError("Email is required", 400);
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await User.findOne({ email: normalizedEmail });
		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (user.verified) {
			throw new AppError("Email already verified", 400);
		}

		// ==================== GENERATE & STORE NEW CODE ========================
		const verificationCode = Math.floor(
			100000 + Math.random() * 900000,
		).toString();
		const verificationExpires = Date.now() + 10 * 60 * 1000; // 10 mins

		await AuthCodes.findOneAndUpdate(
			{ userId: user._id },
			{
				verificationCode,
				verificationExpires,
			},
			{ upsert: true, new: true },
		);

		// ==================== SEND VERIFICATION EMAIL ========================
		const emailTemplate = verificationEmail({
			firstName: user.firstName,
			code: verificationCode,
		});

		await sendGmail({
			to: user.email,
			...emailTemplate,
		});

		return res.status(200).json({
			success: true,
			message: "Verification code sent",
		});
	} catch (error) {
		next(error);
	}
}

// ========================== VERIFY EMAIL ==========================
export async function verifyEmail(req, res, next) {
	try {
		const { email, code } = req.body;

		if (!email || !code) {
			throw new AppError("Email and code are required", 400);
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await User.findOne({ email: normalizedEmail });
		if (!user) {
			throw new AppError("User not found", 404);
		}

		if (user.verified) {
			throw new AppError("Email already verified", 400);
		}

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

		//=========================== DELETE USED CODE ========================
		await AuthCodes.deleteOne({ userId: user._id });

		// ==================== SEND WELCOME EMAIL ========================
		const emailTemplate = welcomeEmail({ firstName: user.firstName });

		await sendGmail({
			to: user.email,
			...emailTemplate,
		});

		return res.status(200).json({
			success: true,
			message: "Email verified successfully",
		});
	} catch (error) {
		next(error);
	}
}

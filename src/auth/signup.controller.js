// ===============================
// src/auth/signup.controller.js
// ===============================

// ===========================================
import User from "../user/userAuth.model.js";
import AuthCodes from "../auth/authCodes.model.js";
import { signupSchema } from "../shared/middleware/validators/authValidator.js";
import { doHash } from "../utils/hashing.js";
import { sendGmail } from "../utils/gmailApiMailer.js";
import { verificationEmail } from "../utils/emailTemplates.js";

// ========================== SIGNUP CONTROLLER =========================
export const signup = async (req, res) => {
	const { firstName, lastName, email, password, confirmPassword } = req.body;

	try {
		// debug log to trace validation flow
		console.log("Signup payload received:", req.body);
		const { error } = signupSchema.validate({
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		const existingUser = await User.findOne({ email: normalizedEmail });

		//  debug log to trace user creation flow
		console.log("Creating new user in database...");

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		const hashedPassword = await doHash(password, 12);
		const code = Math.floor(100000 + Math.random() * 900000).toString();

		// ========================== CREATE USER (UNVERIFIED) ========================
		const user = await User.create({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: normalizedEmail,
			password: hashedPassword,
			verified: false,
		});

		// ========================== CREATE AUTH CODE ========================
		await AuthCodes.create({
			userId: user._id,
			verificationCode: code,
			verificationExpires: Date.now() + 15 * 60 * 1000,
		});

		const emailTemplate = verificationEmail({ firstName, code });

		console.log(`🔑 Verification code for ${normalizedEmail}: ${code}`);

		await sendGmail({
			to: normalizedEmail,
			...emailTemplate,
		});

		return res.status(201).json({
			success: true,
			message: "Signup successful. Check your email for verification code.",
		});
	} catch (err) {
		console.error("Signup error:", err);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

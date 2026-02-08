// src/controllers/auth/signup.controller.js

// ===============================
import User from "../../models/user/userAuth.model.js";
import { signupSchema } from "../../middlewares/validation/user/authValidator.js";
import { doHash } from "../../utils/user/hashing.js";
import { sendGmail } from "../../services/auth/gmailApiMailer.js";
import { verificationEmail } from "../../services/auth/emailTemplates.js";

// ================= SIGNUP =================
export const signup = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		// ---------------- VALIDATION ----------------
		const { error } = signupSchema.validate({
			firstName,
			lastName,
			email,
			password,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		// ---------------- CHECK EXISTING USER ----------------
		const existingUser = await User.findOne({ email: normalizedEmail });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		// ---------------- CREATE USER ----------------
		const hashedPassword = await doHash(password, 12);
		const code = Math.floor(100000 + Math.random() * 900000).toString();

		await User.create({
			firstName,
			lastName,
			email: normalizedEmail,
			password: hashedPassword,
			verificationCode: code,
			verificationExpires: Date.now() + 15 * 60 * 1000,
			verified: false,
		});

		// ---------------- SEND VERIFICATION EMAIL ----------------
		const emailTemplate = verificationEmail({ firstName, code });

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

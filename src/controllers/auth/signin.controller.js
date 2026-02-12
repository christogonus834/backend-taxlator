// src/controllers/auth/signin.controller.js

// =========================
import jwt from "jsonwebtoken";
import User from "../../models/user/userAuth.model.js";
import { signinSchema } from "../../middlewares/validation/user/authValidator.js";
import { doHashValidation } from "../../utils/user/hashing.js";

// ================= SIGNIN =================
export const signin = async (req, res) => {
	try {
		const { email, password } = req.body;

		// ================= VALIDATION =================
		const { error } = signinSchema.validate({ email, password });
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		// ================= FIND USER =================
		const user = await User.findOne({ email: email.toLowerCase() }).select(
			"+password",
		);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// ================= PASSWORD CHECK =================
		const isValid = await doHashValidation(password, user.password);
		if (!isValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// ================= EMAIL VERIFIED =================
		if (!user.verified) {
			return res.status(403).json({
				success: false,
				message: "Email not verified",
			});
		}

		// ================= TOKEN =================
		if (!process.env.TOKEN_SECRET) {
			throw new Error("TOKEN_SECRET missing in environment");
		}

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
			},
			process.env.TOKEN_SECRET,
			{ expiresIn: "1h" },
		);

		return res.json({
			success: true,
			token,
		});
	} catch (err) {
		console.error("Signin Error:", err);
		return res.status(500).json({
			success: false,
			message: "Server error during signin",
		});
	}
};
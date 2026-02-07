// src/controllers/auth/signin.controller.js

// ===============================
import jwt from "jsonwebtoken";
import User from "../../models/user/userAuth.model.js";
import { signinSchema } from "../../middlewares/validation/user/authValidator.js";
import { doHashValidation } from "../../utils/user/hashing.js";

// ================= SIGNIN =================
export const signin = async (req, res) => {
	const { email, password } = req.body;

	const { error } = signinSchema.validate({ email, password });
	if (error)
		return res
			.status(400)
			.json({ success: false, message: error.details[0].message });

	const user = await User.findOne({ email: email.toLowerCase() }).select(
		"+password",
	);

	if (!user || !(await doHashValidation(password, user.password)))
		return res
			.status(401)
			.json({ success: false, message: "Invalid credentials" });

	if (!user.verified)
		return res
			.status(403)
			.json({ success: false, message: "Email not verified" });

	const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
		expiresIn: "1h",
	});

	return res.json({ success: true, token });
};

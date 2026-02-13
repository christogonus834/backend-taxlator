// ===============================
// src/auth/checkEmail.controller.js
// ===============================

// ===============================
import User from "../user/userAuth.model.js";
// ===============================

// ======================= CHECK EMAIL CONTROLLER =======================
export async function checkEmailController(req, res) {
	try {
		const { email } = req.query;
		if (!email) {
			return res
				.status(400)
				.json({ success: false, message: "Email is required" });
		}

		const exists = await User.exists({ email: email.toLowerCase() });

		return res.json({ success: true, exists: !!exists });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, message: "Server error" });
	}
}

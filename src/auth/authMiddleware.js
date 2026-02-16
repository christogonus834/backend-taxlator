// ===============================
// src/auth/authMiddleware.js
// =======================

// ===============================
import jwt from "jsonwebtoken";
import User from "../user/userAuth.model.js";
// ===============================

// ================= GET TOKEN =================
const getBearerToken = (req) => {
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer "))
		return authHeader.split(" ")[1];

	const cookieToken = req.cookies?.taxlator_token;
	if (cookieToken && cookieToken.startsWith("Bearer "))
		return cookieToken.split(" ")[1];

	return null;
};

// ================= PROTECT ROUTES =================
export const protect = async (req, res, next) => {
	try {
		const token = getBearerToken(req);
		if (!token)
			return res
				.status(401)
				.json({ success: false, message: "Not authorized — no token" });

		if (!process.env.TOKEN_SECRET)
			throw new Error("TOKEN_SECRET missing in environment");

		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await User.findById(decoded.id).select("-password");

		if (!user)
			return res
				.status(401)
				.json({ success: false, message: "User no longer exists" });

		req.user = user;
		next();
	} catch (err) {
		return res
			.status(401)
			.json({ success: false, message: "Token invalid or expired" });
	}
};

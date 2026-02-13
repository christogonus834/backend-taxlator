// ========================
// src/shared/requireAuth.js
// ========================

// ========================
import jwt from "jsonwebtoken";
import User from "../user/userAuth.model.js";

// ======================== REQUIRE AUTH MIDDLEWARE ========================
const requireAuth = async (req, res, next) => {
	const header = req.headers.authorization;
	let token = null;

	if (header?.startsWith("Bearer ")) {
		token = header.split(" ")[1];
	}

	if (!token) return next();

	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		if (!decoded?.id) return next();

		const user = await User.findById(decoded.id).select("_id email");
		if (user) req.user = user;
	} catch (err) {}

	next();
};
// ========================

export { requireAuth };

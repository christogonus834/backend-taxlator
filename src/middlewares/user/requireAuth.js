// src/middlewares/user/requireAuth.js

// ========================
import jwt from "jsonwebtoken";
import User from "../../models/user/userAuth.model.js";

const requireAuth = async (req, res, next) => {
	const header = req.headers.authorization;
	let token = null;

	if (header?.startsWith("Bearer ")) {
		token = header.split(" ")[1];
	}

	if (!token) return next(); // 👈 allow guest access

	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		if (!decoded?.id) return next();

		const user = await User.findById(decoded.id).select("_id email");
		if (user) req.user = user;
	} catch (err) {
		// silent failure — calculation still works
	}

	next();
};

export { requireAuth };

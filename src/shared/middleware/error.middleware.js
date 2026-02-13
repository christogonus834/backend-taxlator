// =================================
// src/shared/middleware/error.middleware.js
// =================================

// =================================
import { AppError } from "../../shared/AppError.js";

// ============================== GLOBAL ERROR HANDLER MIDDLEWARE ==============================
const errorMiddleware = (err, req, res, next) => {
	const isAppError = err instanceof AppError;
	const statusCode = isAppError ? err.statusCode : 500;
	const isProd = process.env.NODE_ENV === "production";

	console.error("API_ERROR", {
		requestId: req.requestId,
		message: err.message,
		statusCode,
		stack: isProd ? undefined : err.stack,
	});

	res.status(statusCode).json({
		success: false,
		message: statusCode >= 500 ? "Internal Server Error" : err.message,
		requestId: req.requestId,
	});
};

// =================================
export default errorMiddleware;

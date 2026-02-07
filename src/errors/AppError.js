// src/errors/AppError.js
// ===============================

// ======================== Error class for application-specific errors ========================
export class AppError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;

		// Maintains proper stack trace (V8)
		Error.captureStackTrace(this, this.constructor);
	}
}

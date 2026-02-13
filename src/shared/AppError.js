// ========================
// src/shared/AppError.js
// ===============================

// ======================== Error class for application-specific errors ========================
export class AppError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;

		Error.captureStackTrace(this, this.constructor);
	}
}

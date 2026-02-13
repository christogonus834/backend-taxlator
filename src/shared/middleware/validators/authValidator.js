// =================================
// src/middlewares/validation/user/authValidator.js
// =================================================

// =================================
import Joi from "joi";
// =================================

/* ================= SIGNUP VALIDATION ================= */
export const signupSchema = Joi.object({
	firstName: Joi.string().trim().min(2).max(30).required(),
	lastName: Joi.string().trim().min(2).max(30).required(),
	email: Joi.string()
		.trim()
		.lowercase()
		.min(6)
		.max(50)
		.email()
		.required()
		.messages({
			"string.empty": "Email is required",
			"string.email": "Email must be a valid email address",
		}),

	password: Joi.string()
		.min(8)
		.pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._])[A-Za-z\d@$!%*?&._]{8,}$/,
		)
		.required()
		.messages({
			"string.min": "Password must be at least 8 characters long",
			"string.pattern.base":
				"Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
		}),

	confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
		"string.empty": "Confirm password is required",
		"any.only": "Passwords do not match",
	}),
}).options({ abortEarly: false });

/* ================= SIGNIN VALIDATION ================= */
export const signinSchema = Joi.object({
	email: Joi.string()
		.trim()
		.lowercase()
		.min(6)
		.max(50)
		.email()
		.required()
		.messages({
			"string.empty": "Email is required",
			"string.email": "Email must be a valid email address",
		}),

	password: Joi.string().min(8).required().messages({
		"string.empty": "Password is required",
		"string.min": "Password must be at least 8 characters long",
	}),
}).options({ abortEarly: false });

// =================================
// src/middlewares/tax/cit.validator.js
// =================================

// ===========================
import Joi from "joi";
// =================================

// ===================== CIT VALIDATOR =====================
export const citSchemaValidator = Joi.object({
	taxableProfit: Joi.number().positive().required(),
	annualTurnover: Joi.number().positive().required(),
	fixedAssets: Joi.number().min(0).required(),
	isMultinational: Joi.boolean().default(false),

	accountingProfit: Joi.when("isMultinational", {
		is: true,
		then: Joi.number().positive().required(),
		otherwise: Joi.forbidden(),
	}),

	notes: Joi.string().optional(),
});

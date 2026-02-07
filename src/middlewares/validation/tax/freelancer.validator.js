// src/middlewares/tax/freelancer.validator.js

// ============================
import Joi from "joi";

// ======================= FREELANCER VALIDATION SCHEMA =======================
export const freelancerSchemaValidator = Joi.object({
	grossAnnualIncome: Joi.number().positive().required(),

	totalBusinessExpenses: Joi.number().min(0).default(0),
	freelancerPensionContribution: Joi.number().min(0).default(0),

	notes: Joi.string().optional(),
});

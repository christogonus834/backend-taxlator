// =================================
// src/middlewares/tax/payePit.validator.js
// =================================

// ===========================
import Joi from "joi";
// =================================

// ================== PAYE/PIT VALIDATOR ==================
export const payePitSchemaValidator = Joi.object({
	grossAnnualIncome: Joi.number().positive().required(),
	payePitPensionContribution: Joi.boolean().default(true),
	nationalHealthInsuranceScheme: Joi.boolean().default(false),
	nationalHousingFund: Joi.boolean().default(false),
	rentRelief: Joi.number().min(0).default(0),
	otherDeductions: Joi.number().min(0).default(0),
	notes: Joi.string().optional(),
});

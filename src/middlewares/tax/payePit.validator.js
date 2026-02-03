// src/middlewares/tax/payePit.validator.js

// ================== PAYE/PIT VALIDATOR ==================
import Joi from "joi";

export const payePitSchema = Joi.object({
	grossAnnualIncome: Joi.number().positive().required(),

	payePitPensionContribution: Joi.boolean().default(true),
	nationalHealthInsuranceScheme: Joi.boolean().default(false),
	nationalHousingFund: Joi.boolean().default(false),

	rentRelief: Joi.number().min(0).default(0),
	otherDeductions: Joi.number().min(0).default(0),

	notes: Joi.string().optional(),
});

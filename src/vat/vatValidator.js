// =================================
// src/middlewares/validation/vat/vatValidator.js
// =================================

// ============================
import Joi from "joi";
// =================================

// ===================== VAT CALCULATOR VALIDATION SCHEMA =====================
export const vatSchemaValidator = Joi.object({
	transactionAmount: Joi.number().positive().required(),
	calculationType: Joi.string().valid("add", "remove").required(),
	transactionType: Joi.string()
		.valid(
			"Domestic sale/Purchase",
			"Digital Services",
			"Export/International",
			"Exempt Items",
		)
		.required(),
});

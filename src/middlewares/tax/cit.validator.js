// src/middlewares/tax/cit.validator.js

import Joi from "joi";

export const citSchema = Joi.object({
	taxableProfit: Joi.number().positive().required(),

	accountingProfit: Joi.when("companySize", {
		is: "multinational",
		then: Joi.number().positive().required(),
		otherwise: Joi.optional(),
	}),

	companySize: Joi.string().valid("small", "other", "multinational").required(),

	notes: Joi.string().optional(),
});

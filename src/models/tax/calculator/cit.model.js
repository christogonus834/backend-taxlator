// src/models/taxCalculator/cit.model.js
// =========================

// Mongoose model + calculation engine for CIT
// =========================

import mongoose from "mongoose";
import { baseTaxFields } from "../../tax/calculator/baseTax.schema.js";

// ===================== CIT =====================

const CitSchema = new mongoose.Schema(
	{
		...baseTaxFields,

		annualTurnover: {
			type: Number,
			min: 0,
			required: true,
		},

		fixedAssets: {
			type: Number,
			min: 0,
			default: 0,
		},

		taxableProfit: {
			type: Number,
			min: 0,
			required: true,
		},

		companySize: {
			type: String,
			enum: ["SMALL", "OTHER", "MULTINATIONAL"],
			required: true,
		},

		// Only required for MULTINATIONAL
		accountingProfit: {
			type: Number,
			min: 0,
			default: 0,
		},
	},
	{ timestamps: true },
);

// ===================== Static calculation method =====================
CitSchema.statics.calculate = function (input) {
	const { taxableProfit, accountingProfit = 0, companySize } = input;

	if (taxableProfit <= 0) {
		return {
			taxableIncome: 0,
			annualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
		};
	}

	let annualTax = 0;

	switch (companySize) {
		case "SMALL":
			annualTax = 0;
			break;

		case "OTHER":
			annualTax = taxableProfit * 0.3;
			break;

		case "MULTINATIONAL": {
			if (accountingProfit <= 0) {
				throw new Error(
					"Accounting profit is required for multinational companies",
				);
			}

			const standardTax = taxableProfit * 0.3;
			const minimumTax = accountingProfit * 0.15;

			annualTax = Math.max(standardTax, minimumTax);
			break;
		}

		default:
			throw new Error("Invalid company size");
	}

	const monthlyTax = annualTax / 12;

	const effectiveTaxRate =
		accountingProfit === 0 ? 0 : annualTax / accountingProfit;

	return {
		taxableIncome: taxableProfit,
		annualTax,
		monthlyTax,
		effectiveTaxRate,
	};
};

const Cit = mongoose.model("Cit", CitSchema);

export default Cit;

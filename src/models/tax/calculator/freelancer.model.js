// src/models/tax/calculator/freelancer.model.js
// =========================

// Mongoose model + calculation engine for FREELANCER tax
// =========================

import mongoose from "mongoose";
import { baseTaxFields } from "../../tax/calculator/baseTax.schema.js";

// ===================== FREELANCER =====================

const FreelancerSchema = new mongoose.Schema(
	{
		...baseTaxFields,

		grossAnnualIncome: {
			type: Number,
			min: 0,
			required: true,
		},

		freelancerPensionContribution: {
			type: Number,
			min: 0,
			default: 0,
		},

		totalBusinessExpenses: {
			type: Number,
			min: 0,
			default: 0,
		},
	},
	{ timestamps: true },
);

// ===================== Progressive tax bands (2026) =====================
const TAX_BANDS = [
	{ limit: 800_000, rate: 0 },
	{ limit: 3_000_000, rate: 0.15 },
	{ limit: 12_000_000, rate: 0.18 },
	{ limit: 25_000_000, rate: 0.21 },
	{ limit: 50_000_000, rate: 0.23 },
	{ limit: Infinity, rate: 0.25 },
];

// ===================== Static calculation method =====================
FreelancerSchema.statics.calculate = function (input) {
	const {
		grossAnnualIncome,
		totalBusinessExpenses = 0,
		freelancerPensionContribution = 0,
	} = input;

	if (grossAnnualIncome <= 0) {
		return {
			taxableIncome: 0,
			annualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
		};
	}

	// ===================== Taxable income =====================
	const taxableIncome = Math.max(
		grossAnnualIncome - totalBusinessExpenses - freelancerPensionContribution,
		0,
	);

	// ===================== Progressive tax calculation =====================
	let remainingIncome = taxableIncome;
	let annualTax = 0;
	let previousLimit = 0;

	for (const band of TAX_BANDS) {
		if (remainingIncome <= 0) break;

		const bandSize = band.limit - previousLimit;
		const taxableAtThisBand = Math.min(remainingIncome, bandSize);

		annualTax += taxableAtThisBand * band.rate;

		remainingIncome -= taxableAtThisBand;
		previousLimit = band.limit;
	}

	const monthlyTax = annualTax / 12;

	const effectiveTaxRate =
		grossAnnualIncome === 0 ? 0 : annualTax / grossAnnualIncome;

	return {
		taxableIncome,
		annualTax,
		monthlyTax,
		effectiveTaxRate,
	};
};

const Freelancer = mongoose.model("Freelancer", FreelancerSchema);

export default Freelancer;

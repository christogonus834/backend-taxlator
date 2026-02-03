// src/models/tax/calculator/payePit.model.js
// =========================

// Mongoose model + calculation engine for PAYE/PIT
// =========================

import mongoose from "mongoose";
import { baseTaxFields } from "../../tax/calculator/baseTax.schema.js";

// ===================== PAYE/PIT MODEL =====================

const PayePitSchema = new mongoose.Schema(
	{
		...baseTaxFields,

		grossAnnualIncome: {
			type: Number,
			min: 0,
			required: true,
		},

		payePitPensionContribution: {
			type: Boolean,
			default: true,
		},

		nationalHealthInsuranceScheme: {
			type: Boolean,
			default: true,
		},

		nationalHousingFund: {
			type: Boolean,
			default: true,
		},

		otherDeductions: {
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
PayePitSchema.statics.calculate = function (input) {
	const { grossAnnualIncome, otherDeductions = 0 } = input;

	if (grossAnnualIncome <= 0) {
		return {
			taxableIncome: 0,
			annualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
		};
	}

	// ===================== Mandatory deductions =====================
	const pension = grossAnnualIncome * 0.08;
	const nhis = grossAnnualIncome * 0.05;
	const nhf = grossAnnualIncome * 0.025;
	const rentRelief = grossAnnualIncome * 0.2;

	const totalDeductions = pension + nhis + nhf + rentRelief + otherDeductions;

	const taxableIncome = Math.max(grossAnnualIncome - totalDeductions, 0);

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

const PayePit = mongoose.model("PayePit", PayePitSchema);

export default PayePit;

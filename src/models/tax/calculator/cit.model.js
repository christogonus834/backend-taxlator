// src/models/tax/calculator/cit.model.js

// =========================
import mongoose from "mongoose";
import { baseTaxFields } from "../../tax/calculator/baseTax.schema.js";

// ===================== CIT MODEL =====================

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

		// ================= required for MULTINATIONAL =================
		accountingProfit: {
			type: Number,
			min: 0,
			default: 0,
		},
	},
	{ timestamps: true },
);

// ===================== Static calculation =====================
CitSchema.statics.calculate = function ({
	taxableProfit,
	accountingProfit = 0,
	annualTurnover,
	fixedAssets,
	isMULTINATIONAL,
}) {
	if (taxableProfit <= 0) {
		return {
			companySize: "N/A",
			taxableIncome: 0,
			annualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
		};
	}

	let companySize;
	let annualTax = 0;
	let breakdown = {};

	// ================= MULTINATIONAL =================
	if (isMultinational) {
		if (accountingProfit <= 0) {
			throw new Error(
				"Accounting profit is required for multinational companies",
			);
		}

		const normalCIT = taxableProfit * 0.3;
		const minimumTax = accountingProfit * 0.15;

		annualTax = Math.max(normalCIT, minimumTax);

		companySize = "MULTINATIONAL";

		breakdown = {
			companyType: "MULTINATIONAL/ Very Large",
			normalCIT,
			minimumTax,
			finalTax: annualTax,
		};
	}

	// ================= SMALL =================
	else if (annualTurnover <= 100_000_000 && fixedAssets <= 250_000_000) {
		companySize = "SMALL";
		annualTax = 0;

		breakdown = {
			companyType: "Small Company",
			citRateApplied: 0,
		};
	}

	// ================= OTHER =================
	else {
		companySize = "OTHER";
		annualTax = taxableProfit * 0.3;

		breakdown = {
			companyType: "Other Company",
			citRateApplied: 30,
		};
	}

	return {
		companySize,
		taxableIncome: taxableProfit,
		annualTax,
		monthlyTax: annualTax / 12,
		effectiveTaxRate: accountingProfit > 0 ? annualTax / accountingProfit : 0,
		breakdown,
	};
};

const Cit = mongoose.model("Cit", CitSchema);
export default Cit;

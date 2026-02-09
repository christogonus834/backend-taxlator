// src/models/tax/calculator/payePit.model.js

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

		rentRelief: {
			type: Number,
			min: 0,
			default: 0,
		},

		otherDeductions: {
			type: Number,
			min: 0,
			default: 0,
		},
	},
	{ timestamps: true },
);

// NOTE: Removed all static calculate() method — all calculations are now in the service.

const PayePit = mongoose.model("PayePit", PayePitSchema);

export default PayePit;

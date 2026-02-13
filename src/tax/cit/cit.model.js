// ==============================
// src/tax/cit/cit.model.js
// ==============================

// ==============================
import mongoose from "mongoose";
import { baseTaxFields } from "../baseTax.schema.js";
// ==============================

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

		// Required for MULTINATIONAL minimum tax rule
		accountingProfit: {
			type: Number,
			min: 0,
			default: 0,
		},

		appliedRate: {
			type: Number,
			min: 0,
		},

		totalTax: {
			type: Number,
			min: 0,
		},

		netProfitAfterTax: {
			type: Number,
			min: 0,
		},

		minimumTaxApplied: {
			type: Boolean,
			default: false,
		},

		computation: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true },
);

// ==============================
const Cit = mongoose.model("Cit", CitSchema);
// ==============================

export default Cit;

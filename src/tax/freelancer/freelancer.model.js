// ==============================
// src/tax/freelancer/freelancer.model.js
// ==============================

// =========================
import mongoose from "mongoose";
import { baseTaxFields } from "../baseTax.schema.js";
// ==============================

// ===================== FREELANCER SCHEMA =====================
const FreelancerSchema = new mongoose.Schema(
	{
		...baseTaxFields,

		grossAnnualIncome: {
			type: Number,
			min: 0,
			required: true,
		},

		pensionContribution: {
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

// ==============================
const Freelancer = mongoose.model("Freelancer", FreelancerSchema);
// ==============================

export default Freelancer;

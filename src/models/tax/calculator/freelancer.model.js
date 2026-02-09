// src/models/tax/calculator/freelancer.model.js

// =========================
import mongoose from "mongoose";
import { baseTaxFields } from "../../tax/calculator/baseTax.schema.js";

// ===================== FREELANCER SCHEMA =====================
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

const Freelancer = mongoose.model("Freelancer", FreelancerSchema);
export default Freelancer;

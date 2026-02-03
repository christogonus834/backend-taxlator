// src/models/tax/records/taxRecord.Model.js
// =========================

// Canonical audit record for all tax calculations
// =========================

import mongoose from "mongoose";

// ===================== TAX RECORD SCHEMA =====================
const TaxRecordSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},

		taxType: {
			type: String,
			enum: ["PAYE/PIT", "FREELANCER", "CIT"],
			required: true,
			index: true,
		},

		companySize: {
			type: String,
			enum: ["small", "other", "multinational"],
		},

		taxableIncome: {
			type: Number,
			min: 0,
			required: true,
		},

		annualTax: {
			type: Number,
			min: 0,
			required: true,
		},

		monthlyTax: {
			type: Number,
			min: 0,
			required: true,
		},

		effectiveTaxRate: {
			type: Number,
			min: 0,
			max: 1,
			required: true,
		},

		notes: {
			type: String,
		},

		inputSnapshot: {
			type: Object,
		},
	},
	{
		timestamps: true,
	},
);

// ===================== VALIDATION =====================
TaxRecordSchema.pre("validate", function (next) {
	if (this.annualTax < 0 || this.monthlyTax < 0) {
		return next(new Error("Tax values cannot be negative"));
	}

	if (this.monthlyTax * 12 < this.annualTax - 1) {
		return next(new Error("Monthly tax does not align with annual tax"));
	}

	next();
});

const TaxRecord = mongoose.model("TaxRecord", TaxRecordSchema);

export default TaxRecord;

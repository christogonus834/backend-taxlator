// src/models/tax/calculator/baseTax.schema.js
// =========================

// Base fields for tax calculation models.
// ===================== BASE TAX REQUIRED =====================

export const baseTaxFields = {
	// ===================
	taxType: {
		type: String,
		enum: ["PAYE/PIT", "FREELANCER", "CIT"],
		required: true,
		index: true,
	},

	// ===================== COMPUTED RESULT FIELDS =====================
	taxableIncome: Number,
	taxAmount: Number,
	effectiveTaxRate: Number,
};

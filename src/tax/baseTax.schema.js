// ==============================
// src/tax/baseTax.schema.js
// =========================

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

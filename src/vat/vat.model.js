// =============================
// src/models/vat/calculator/vat.model.js
// =============================

// =============================
import mongoose from "mongoose";
// =============================

// ===================== VAT CALCULATION MODEL =====================
const VatSchema = new mongoose.Schema(
	{
		transactionAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		calculationType: {
			type: String,
			enum: ["add", "remove"],
			required: true,
		},
		transactionType: {
			type: String,
			enum: [
				"Domestic sale/Purchase",
				"Digital Services",
				"Export/International",
				"Exempt Items",
			],
			required: true,
		},

		// persisted results (optional but recommended)
		vatRate: Number,
		vatAmount: Number,
		totalAmount: Number,
	},
	{ timestamps: true },
);

// =============================
const VatModel = mongoose.model("VatCalculation", VatSchema);
// =============================

export default VatModel;

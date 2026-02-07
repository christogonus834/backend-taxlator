// src/models/vat/calculator/vat.model.js

// =============================
import mongoose from "mongoose";

// ===================== VAT CALCULATOR MODEL =====================
const VatCalculatorSchema = new mongoose.Schema(
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
	},
	{ timestamps: true },
);

// ===================== Static calculation =====================
VatCalculatorSchema.statics.calculate = function ({
	transactionAmount,
	calculationType,
	transactionType,
}) {
	const VAT_RATES = {
		"Domestic sale/Purchase": 0.075,
		"Digital Services": 0.075,
		"Export/International": 0,
		Exempt: 0,
	};

	const vatRate = VAT_RATES[transactionType];

	if (transactionAmount <= 0) {
		return {
			transactionAmount,
			calculationType,
			transactionType,
			vatRate,
			vatAmount: 0,
			totalAmount: transactionAmount,
		};
	}

	let vatAmount = 0;
	let totalAmount = 0;

	if (calculationType === "add") {
		vatAmount = transactionAmount * vatRate;
		totalAmount = transactionAmount + vatAmount;
	} else if (calculationType === "remove") {
		vatAmount = transactionAmount - transactionAmount / (1 + vatRate);
		totalAmount = transactionAmount - vatAmount;
	} else {
		throw new Error("Invalid calculation type, must be 'add' or 'remove'");
	}

	return {
		transactionAmount,
		calculationType,
		transactionType,
		vatRate,
		vatAmount: parseFloat(vatAmount.toFixed(2)),
		totalAmount: parseFloat(totalAmount.toFixed(2)),
	};
};

const VatCalculation = mongoose.model("VatCalculation", VatCalculatorSchema);
export default VatCalculation;

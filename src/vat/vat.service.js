// ==============================
// src/vat/vat.service.js
// ==============================

// ==============================
import { AppError } from "../shared/AppError.js";
// ==============================

// ===================== VAT RATE MAP =====================
const VAT_RATES = {
	"Domestic sale/Purchase": 0.075,
	"Digital Services": 0.075,
	"Export/International": 0,
	"Exempt Items": 0,
};

// ===================== VAT CALCULATION SERVICE =====================
export function calculateVat({
	transactionAmount,
	calculationType,
	transactionType,
}) {
	// ===================== VALIDATION =====================
	if (transactionAmount == null || transactionAmount < 0) {
		throw new AppError("Transaction amount must be a positive number", 400);
	}

	if (!VAT_RATES.hasOwnProperty(transactionType)) {
		throw new AppError("Invalid transaction type", 400);
	}

	if (!["add", "remove"].includes(calculationType)) {
		throw new AppError(
			"Invalid calculation type. Must be 'add' or 'remove'",
			400,
		);
	}

	const vatRate = VAT_RATES[transactionType];

	// ===================== ZERO VAT CASES =====================
	if (vatRate === 0 || transactionAmount === 0) {
		return {
			transactionAmount,
			calculationType,
			transactionType,
			vatRate,
			vatAmount: 0,
			totalAmount: transactionAmount,
			baseAmount: transactionAmount,
		};
	}

	// ===================== VAT CALCULATION =====================
	let vatAmount, totalAmount, baseAmount;

	if (calculationType === "add") {
		vatAmount = transactionAmount * vatRate;
		baseAmount = transactionAmount;
		totalAmount = transactionAmount + vatAmount;
	} else {
		baseAmount = transactionAmount / (1 + vatRate);
		vatAmount = transactionAmount - baseAmount;
		totalAmount = transactionAmount;
	}

	return {
		transactionAmount,
		calculationType,
		transactionType,
		vatRate,
		vatAmount: Number(vatAmount.toFixed(2)),
		totalAmount: Number(totalAmount.toFixed(2)),
		baseAmount: Number(baseAmount.toFixed(2)),
	};
}

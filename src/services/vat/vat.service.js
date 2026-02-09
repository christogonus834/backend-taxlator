// src/services/vat/vat.service.js

// =============================
import { AppError } from "../../errors/AppError.js";

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
	// ---------- validations ----------
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

	// ---------- zero VAT cases ----------
	if (vatRate === 0 || transactionAmount === 0) {
		return {
			transactionAmount,
			calculationType,
			transactionType,
			vatRate,
			vatAmount: 0,
			totalAmount: transactionAmount,
		};
	}

	// ---------- VAT calculation ----------
	let vatAmount;
	let totalAmount;

	if (calculationType === "add") {
		// VAT-exclusive → add VAT
		vatAmount = transactionAmount * vatRate;
		totalAmount = transactionAmount + vatAmount;
	} else {
		// VAT-inclusive → extract VAT
		const baseAmount = transactionAmount / (1 + vatRate);
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
	};
}

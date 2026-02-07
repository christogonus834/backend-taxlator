// src/services/vat/vat.service.js

// =============================
import { AppError } from "../../errors/AppError.js";

// ===================== VAT CALCULATION SERVICE =====================
export function calculateVat({
	transactionAmount,
	vatRate = 0.075,
	calculationType = "add",
}) {
	if (transactionAmount == null || transactionAmount < 0) {
		throw new AppError("Transaction amount must be a positive number", 400);
	}

	// ---------- VAT calculation ----------
	let vatAmount = 0;
	let totalAmount = transactionAmount;

	if (calculationType === "add") {
		vatAmount = transactionAmount * vatRate;
		totalAmount = transactionAmount + vatAmount;
	} else if (calculationType === "remove") {
		vatAmount = transactionAmount - transactionAmount / (1 + vatRate);
		totalAmount = transactionAmount;
	} else {
		throw new AppError(
			"Invalid calculation type. Must be 'add' or 'remove'",
			400,
		);
	}

	return {
		transactionAmount,
		vatRate,
		vatAmount,
		totalAmount,
		calculationType,
	};
}

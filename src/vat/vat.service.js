// ===============================
//src/vat/vat.service.js
// ===============================

// ===============================
import { AppError } from "../shared/AppError.js";
// ===============================

// ===============================
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
	if (transactionAmount == null || transactionAmount < 0) {
		throw new AppError("Transaction amount is required and must be >= 0", 400);
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

	let vatAmount, totalAmount, baseAmount;

	if (calculationType === "add") {
		baseAmount = transactionAmount;
		vatAmount = baseAmount * vatRate;
		totalAmount = baseAmount + vatAmount;
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
		baseAmount: Number(baseAmount.toFixed(2)),
		totalAmount: Number(totalAmount.toFixed(2)),
	};
}

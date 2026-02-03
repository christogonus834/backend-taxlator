// src/dtos/vatResult.dto.js
// =========================
// Normalized VAT result shape for frontend consumption

export function mapVATRecordToResult(record) {
	return {
		transactionAmount: record.transactionAmount,
		vatRate: record.rate,
		vatAmount: record.vatAmount,
		includingVat: record.transactionAmount,
		excludingVat: record.transactionAmount,
		transactionType: record.transactionType,
		calculationType: record.calculationType,
	};
}

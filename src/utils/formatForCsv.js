// =========================
// src/utils/history/formatForCsv.js
// =========================

// ========================= HISTORY CSV FORMATTER =========================
export const formatHistoryForCsv = (items) => {
	return items.map((item) => {
		const base = {
			TaxType: item.type,
			Date: item.createdAt.toISOString(),
		};

		switch (item.type) {
			case "PAYE":
			case "FREELANCER":
				return {
					...base,
					AnnualIncome: item.input.annualIncome,
					TaxableIncome: item.result.summary?.taxableIncome,
					TaxDue: item.result.summary?.annualTax,
				};

			case "CIT":
				return {
					...base,
					Turnover: item.input.annualTurnover,
					TaxableProfit: item.input.taxableProfit,
					CITPayable: item.result.summary?.finalTax,
				};

			case "VAT":
				return {
					...base,
					TransactionType: item.input.transactionType,
					TransactionAmount: item.input.transactionAmount,
					VATRate: item.result.summary?.vatRate,
					VATAmount: item.result.summary?.vatAmount,
					TotalWithVAT: item.result.summary?.totalAmount,
				};

			default:
				return base;
		}
	});
};

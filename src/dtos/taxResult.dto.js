// src/dtos/taxResult.dto.js
// =========================

// ========================= TAX RESULT DATA TRANSFER OBJECT (DTO) =========================
export class TaxResultDTO {
	/**
	 * @param {Object} result - raw tax calculation result
	 * @param {Object} options - optional settings
	 * @param {number} options.decimals - number of decimals to round numbers (default 0)
	 * @param {string} options.taxType - e.g., "PAYE/PIT", "CIT", "Freelancer"
	 * @param {string} options.country - country code for future use
	 */
	constructor(result, options = {}) {
		const decimals = options.decimals ?? 0;

		// ---------- Rounded numbers ----------
		this.taxableProfit =
			result.taxableProfit != null ? Math.round(result.taxableProfit) : 0;
		this.annualTurnover =
			result.annualTurnover != null ? Math.round(result.annualTurnover) : 0;
		this.accountingProfit =
			result.accountingProfit != null ? Math.round(result.accountingProfit) : 0;
		this.appliedRate = Number((result.appliedRate ?? 0).toFixed(2));
		this.totalTax = result.totalTax != null ? Math.round(result.totalTax) : 0;
		this.netProfitAfterTax =
			result.netProfitAfterTax != null
				? Math.round(result.netProfitAfterTax)
				: 0;
		this.minimumTaxApplied = result.minimumTaxApplied ?? false;
		this.computation = result.computation ?? [];

		// ---------- Formatted strings ----------
		const formatNumber = (num) =>
			num.toLocaleString("en-US", {
				minimumFractionDigits: 0,
				maximumFractionDigits: decimals,
			});
		this.taxableProfitFormatted = formatNumber(this.taxableProfit);
		this.annualTurnoverFormatted = formatNumber(this.annualTurnover);
		this.accountingProfitFormatted = formatNumber(this.accountingProfit);
		this.totalTaxFormatted = formatNumber(this.totalTax);
		this.netProfitAfterTaxFormatted = formatNumber(this.netProfitAfterTax);
		this.appliedRateFormatted = `${(this.appliedRate * 100).toFixed(2)}%`;

		// ---------- Optional metadata ----------
		if (options.taxType) this.taxType = options.taxType;
		if (options.country) this.country = options.country;

		// ---------- Store raw numbers too ----------
		this._raw = result;
	}
}

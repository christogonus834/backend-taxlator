// src/dtos/vatResult.dto.js
// =========================

// ========================= VAT RESULT DATA TRANSFER OBJECT (DTO) =========================
export class VATResultDTO {
	constructor(result, options = {}) {
		const decimals = options.decimals ?? 2;
		const rateDecimals = options.rateDecimals ?? 2;

		this.transactionAmount = Number(result.transactionAmount.toFixed(decimals));
		this.vatRate = Number(result.vatRate.toFixed(rateDecimals));
		this.vatAmount = Number(result.vatAmount.toFixed(decimals));
		this.includingVat = Number(result.totalAmount.toFixed(decimals));
		this.excludingVat = Number(result.transactionAmount.toFixed(decimals));

		this.transactionType = result.transactionType || "SALE";
		this.calculationType = result.calculationType || "ADD";
		this.customer = result.customer || null;
		this.invoiceNumber = result.invoiceNumber || null;

		// ---------- Formatted strings ----------
		const formatNumber = (num) =>
			num.toLocaleString("en-US", {
				minimumFractionDigits: 0,
				maximumFractionDigits: decimals,
			});

		this.transactionAmountFormatted = formatNumber(this.transactionAmount);
		this.vatAmountFormatted = formatNumber(this.vatAmount);
		this.includingVatFormatted = formatNumber(this.includingVat);
		this.excludingVatFormatted = formatNumber(this.excludingVat);
		this.vatRateFormatted = `${(this.vatRate * 100).toFixed(rateDecimals)}%`;

		// ---------- Optional metadata ----------
		if (options.country) this.country = options.country;
		if (options.taxType) this.taxType = options.taxType;

		// ---------- Store raw numbers ----------
		this._raw = {
			transactionAmount: result.transactionAmount,
			vatRate: result.vatRate,
			vatAmount: result.vatAmount,
			totalAmount: result.totalAmount,
		};
	}
}

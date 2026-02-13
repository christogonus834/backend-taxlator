// ============================
// src/dtos/vat/vatResult.dto.js
// ============================

// =========================
import { BaseVATDTO } from "./baseVat.dto.js";

//  ========================= VAT RESULT DATA TRANSFER OBJECT (DTO) =========================
export class VATResultDTO extends BaseVATDTO {
	constructor(result, options = {}) {
		const decimals = options.decimals ?? 2;
		const rateDecimals = options.rateDecimals ?? 2;

		//  ========================= Raw numeric values =========================
		this.transactionAmount = Number(result.transactionAmount.toFixed(decimals));
		this.baseAmount = Number(result.baseAmount.toFixed(decimals));
		this.vatRate = Number(result.vatRate.toFixed(rateDecimals));
		this.vatAmount = Number(result.vatAmount.toFixed(decimals));
		this.totalAmount = Number(result.totalAmount.toFixed(decimals));

		this.transactionType = result.transactionType || "SALE";
		this.calculationType = result.calculationType || "ADD";
		this.customer = result.customer || null;
		this.invoiceNumber = result.invoiceNumber || null;

		//  ========================= Formatted strings =========================
		const formatNumber = (num) =>
			num.toLocaleString("en-US", {
				minimumFractionDigits: 0,
				maximumFractionDigits: decimals,
			});

		this.transactionAmountFormatted = formatNumber(this.transactionAmount);
		this.baseAmountFormatted = formatNumber(this.baseAmount);
		this.vatAmountFormatted = formatNumber(this.vatAmount);
		this.totalAmountFormatted = formatNumber(this.totalAmount);
		this.vatRateFormatted = `${(this.vatRate * 100).toFixed(rateDecimals)}%`;

		//  ========================= Optional metadata =========================
		if (options.country) this.country = options.country;
		if (options.taxType) this.taxType = options.taxType;

		//  ========================= Store raw numbers =========================
		this._raw = {
			transactionAmount: result.transactionAmount,
			baseAmount: result.baseAmount,
			vatRate: result.vatRate,
			vatAmount: result.vatAmount,
			totalAmount: result.totalAmount,
		};
	}
}

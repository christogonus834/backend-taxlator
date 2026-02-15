// ============================
// src/dtos/vat/vatResult.dto.js
// ============================

import { BaseVATDTO } from "./baseVat.dto.js";

// ========================= VAT RESULT DATA TRANSFER OBJECT (DTO) =========================
export class VATResultDTO extends BaseVATDTO {
	constructor(raw = {}, decimals = 2, rateDecimals = 2) {
		super({
			taxType: "VAT",
			country: {
				name: "Nigeria",
				code: "NG",
			},
		});

		const transactionAmount = raw.transactionAmount ?? 0;
		const baseAmount = raw.baseAmount ?? 0;
		const vatAmount = raw.vatAmount ?? 0;
		const totalAmount = raw.totalAmount ?? 0;
		const vatRate = raw.vatRate ?? 0;

		// ================= SUMMARY =================
		this.summary = {
			transactionAmount: Number(transactionAmount),
			baseAmount: Number(baseAmount),
			vatAmount: Number(vatAmount),
			totalAmount: Number(totalAmount),
			vatRate: Number(vatRate),
		};

		// ================= TOTALS =================
		this.totals = {
			totalWithVat: Number(totalAmount.toFixed(decimals)),
			totalVat: Number(vatAmount.toFixed(decimals)),
		};

		// ================= PROGRESSIVE / FORMATTED =================
		const formatNumber = (num) =>
			num.toLocaleString("en-US", {
				minimumFractionDigits: 0,
				maximumFractionDigits: decimals,
			});

		this.progressive = {
			transactionType: raw.transactionType ?? null,
			calculationType: raw.calculationType ?? null,
			transactionAmountFormatted: formatNumber(transactionAmount),
			baseAmountFormatted: formatNumber(baseAmount),
			vatAmountFormatted: formatNumber(vatAmount),
			totalAmountFormatted: formatNumber(totalAmount),
			vatRateFormatted: `${(vatRate * 100).toFixed(rateDecimals)}%`,
		};

		// ================= RAW =================
		this._raw = {
			transactionAmount,
			baseAmount,
			vatAmount,
			totalAmount,
			vatRate,
			transactionType: raw.transactionType ?? null,
			calculationType: raw.calculationType ?? null,
		};
	}
}

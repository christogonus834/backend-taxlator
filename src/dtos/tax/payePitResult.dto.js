// src/dtos/tax/payePitResult.dto.js

import { BaseTaxDTO } from "./baseTax.dto.js";
// ========================= PAYE/PIT RESULT DATA TRANSFER OBJECT (DTO)
export class PayePitResultDTO extends BaseTaxDTO {
	constructor(raw = {}) {
		super({ taxType: "PAYE/PIT", country: "NIGERIA" });

		const gross = raw.grossAnnualIncome ?? 0;

		// ================= SUMMARY =================
		this.summary = {
			grossAnnualIncome: gross,
			netAnnualIncome: Math.round(raw.netAnnualIncome),
			totalAnnualTax: Math.round(raw.totalAnnualTax),
			monthlyTax: Math.round(raw.monthlyTax),
		};

		// ================= DEDUCTIONS =================
		this.deductions = {
			rentRelief: Math.round(raw.deductions?.rentRelief ?? 0),
			pension: Math.round(raw.deductions?.pension ?? 0),
			nhis: Math.round(raw.deductions?.nhis ?? 0),
			nhf: Math.round(raw.deductions?.nhf ?? 0),
			otherDeductions: Math.round(raw.deductions?.otherDeductions ?? 0),
			totalDeductions: Math.round(raw.totalDeductions),
			taxableIncome: Math.round(raw.taxableIncome),
		};

		// ================= PROGRESSIVE =================
		this.progressive = {
			bands: (raw.taxBreakdown || []).map((b, index) => ({
				label: raw.progressiveTaxBands?.[index]?.label ?? "Tax Band",
				rate: b.rate,
				rateFormatted: `${(b.rate * 100).toFixed(0)}%`,
				taxableAmount: Math.round(b.taxableAmount),
				tax: Math.round(b.tax),
				taxFormatted: this.formatNumber(Math.round(b.tax)),
			})),
			totalAnnualTax: Math.round(raw.totalAnnualTax),
			monthlyTax: Math.round(raw.monthlyTax),
		};
	}

	buildBandLabel(index) {
		const ranges = [
			"#0 - ₦800,000",
			"#800,001 - ₦3,000,000",
			"#3,000,001 - ₦12,000,000",
			"#12,000,001 - ₦25,000,000",
			"#25,000,001 - ₦50,000,000",
			"Above ₦50,000,000",
		];
		return ranges[index] ?? "Above ₦50,000,000";
	}
}

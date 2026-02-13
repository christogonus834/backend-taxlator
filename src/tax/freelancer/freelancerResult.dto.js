// ============================
// src/dtos/tax/freelancer.dto.js
// ========================

// ============================
import { BaseTaxDTO } from "../baseTax.dto.js";
// ============================

// ========================= FREELANCER TAX RESULT DTO =========================
export class FreelancerResultDTO extends BaseTaxDTO {
	constructor(raw = {}) {
		super({
			taxType: raw.taxType ?? "FREELANCER",
			country: raw.country ?? "NIGERIA",
		});

		const gross = raw.grossAnnualIncome ?? 0;

		// ================= SUMMARY =================
		this.summary = {
			grossAnnualIncome: Math.round(gross),
			netAnnualIncome: Math.round(raw.netAnnualIncome ?? 0),
			totalAnnualTax: Math.round(raw.totalAnnualTax ?? 0),
			monthlyTax: Math.round(raw.monthlyTax ?? 0),
			effectiveTaxRate: raw.effectiveTaxRate ?? 0,
		};

		// ================= DEDUCTIONS =================
		this.deductions = {
			totalDeductions: Math.round(raw.totalDeductions ?? 0),
			taxableIncome: Math.round(raw.taxableIncome ?? 0),
		};

		// ================= PROGRESSIVE =================
		this.progressive = {
			bands: (raw.taxBreakdown || []).map((b) => ({
				label: b.label,
				rate: b.rate,
				rateFormatted: b.rateFormatted ?? `${(b.rate * 100).toFixed(0)}%`,
				taxableAmount: Math.round(b.taxableAmount ?? 0),
				tax: Math.round(b.tax ?? 0),
				taxFormatted:
					b.taxFormatted ?? `₦${Math.round(b.tax ?? 0).toLocaleString()}`,
			})),
			totalAnnualTax: Math.round(raw.totalAnnualTax ?? 0),
			monthlyTax: Math.round(raw.monthlyTax ?? 0),
		};
	}
}

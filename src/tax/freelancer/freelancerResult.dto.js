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

		// ================= TOTALS =================
		this.totals = {
			totalDeductions: Math.round(raw.totalDeductions ?? 0),
			taxableIncome: Math.round(raw.taxableIncome ?? 0),
		};

		const bandRanges = [
			{ label: "#0 - ₦800,000", rate: 0, maxLimit: 800000 },
			{ label: "#800,001 - ₦3,000,000", rate: 0.15, maxLimit: 3000000 },
			{ label: "#3,000,001 - ₦12,000,000", rate: 0.18, maxLimit: 12000000 },
			{ label: "#12,000,001 - ₦25,000,000", rate: 0.21, maxLimit: 25000000 },
			{ label: "#25,000,001 - ₦50,000,000", rate: 0.23, maxLimit: 50000000 },
			{ label: "Above ₦50,000,000", rate: 0.25 },
		];

		// ================= PROGRESSIVE =================
		this.progressive = {
			bands: userBands,
			fullBands,
			totalAnnualTax: Math.round(raw.totalAnnualTax ?? 0),
			monthlyTax: Math.round(raw.monthlyTax ?? 0),
		};
	}

	buildBandLabel(index) {
		const ranges = [
			{ label: "#0 - ₦800,000", rate: 0 },
			{ label: "#800,001 - ₦3,000,000", rate: 0.15 },
			{ label: "#3,000,001 - ₦12,000,000", rate: 0.18 },
			{ label: "#12,000,001 - ₦25,000,000", rate: 0.21 },
			{ label: "#25,000,001 - ₦50,000,000", rate: 0.23 },
			{ label: "Above ₦50,000,000", rate: 0.25 },
		];
		return ranges[index] ?? ranges[ranges.length - 1];
	}
}

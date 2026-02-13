// ============================
// src/dtos/tax/freelancer.dto.js
// ============================

import { BaseTaxDTO } from "../baseTax.dto.js";

// ============================ FREELANCER TAX RESULT DTO ============================
export class FreelancerResultDTO extends BaseTaxDTO {
	constructor(raw = {}, decimals = 0) {
		super({
			taxType: "FREELANCER",
			country: {
				name: "Nigeria",
				code: "NG",
			},
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

		// ================= STANDARD DEDUCTIONS =================
		this.standardDeductions = {
			pensionContribution: Math.round(raw.pensionContribution ?? 0),
			businessExpenses: Math.round(raw.totalBusinessExpenses ?? 0),
		};

		// ================= TOTALS =================
		this.totals = {
			totalDeductions: Math.round(raw.totalDeductions ?? 0),
			taxableIncome: Math.round(raw.taxableIncome ?? 0),
		};

		// ================= TAX BANDS =================
		const bandRanges = [
			{ label: "#0 - ₦800,000", rate: 0, maxLimit: 800000 },
			{ label: "#800,001 - ₦3,000,000", rate: 0.15, maxLimit: 3000000 },
			{ label: "#3,000,001 - ₦12,000,000", rate: 0.18, maxLimit: 12000000 },
			{ label: "#12,000,001 - ₦25,000,000", rate: 0.21, maxLimit: 25000000 },
			{ label: "#25,000,001 - ₦50,000,000", rate: 0.23, maxLimit: 50000000 },
			{ label: "Above ₦50,000,000", rate: 0.25 },
		];

		// ================= USER BANDS =================
		const userBands = (raw.progressive?.bands || raw.taxBreakdown || []).map(
			(b, index) => ({
				label: b.label ?? this.buildBandLabel(index).label,
				rate: b.rate ?? 0,
				rateFormatted: `${((b.rate ?? 0) * 100).toFixed(0)}%`,
				taxableAmount: Math.round(b.taxableAmount ?? 0),
				tax: Math.round(b.tax ?? 0),
				taxFormatted: this.formatNumber(Math.round(b.tax ?? 0), decimals),
			}),
		);

		// ================= FULL BANDS =================
		const fullBands = bandRanges.map((b) => {
			const taxableAmount = Math.round(b.maxLimit ?? 0);
			const tax = Math.round((b.maxLimit ?? 0) * b.rate);
			return {
				label: b.label,
				rate: b.rate,
				rateFormatted: `${(b.rate * 100).toFixed(0)}%`,
				taxableAmount,
				tax,
				taxFormatted: this.formatNumber(tax, decimals),
				maxLimit: b.maxLimit ?? null,
			};
		});

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

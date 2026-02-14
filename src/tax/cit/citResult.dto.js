// ============================
// src/dtos/tax/citResult.dto.js
// ============================

// ==============================
import { BaseTaxDTO } from "../baseTax.dto.js";
// ==============================

// ===================== CIT RESULT DATA TRANSFER OBJECT (DTO) =====================§
export class CitResultDTO extends BaseTaxDTO {
	constructor(raw = {}) {
		super({
			taxType: "FREELANCER",
			country: {
				name: "Nigeria",
				code: "NG",
			},
		});

		// ================= SUMMARY =================
		this.summary = {
			taxableProfit: Math.round(raw.taxableProfit ?? 0),
			netProfit: Math.round(raw.netProfitAfterTax ?? 0),
			totalAnnualTax: Math.round(raw.totalTax ?? 0),
			monthlyTax: Math.round((raw.totalTax ?? 0) / 12),
			companySize: raw.companySize,
			appliedRate: raw.appliedRate,
		};

		// ================= BREAKDOWN =================
		this.breakdown = {
			companyType:
				raw.companySize === "SMALL"
					? "Small Company"
					: raw.companySize === "MULTINATIONAL"
						? "Multinational Company"
						: "Other Companies",

			citRate:
				raw.companySize === "SMALL"
					? "0%"
					: raw.companySize === "MULTINATIONAL"
						? "30% vs 15% Min. Tax"
						: "30%",

			taxableProfit: Math.round(raw.taxableProfit ?? 0),
			normalCIT: Math.round(raw.normalCIT ?? 0),
			minimumTax: Math.round(raw.minimumTax ?? 0),
			finalTax: Math.round(raw.totalTax ?? 0),
		};

		// ================= STATIC BAND TABLE =================
		this.progressive = {
			referenceBands: [
				{
					label: "≤ ₦50,000,000 + Assets ≤ ₦250,000,000 (Small Company)",
					rate: "0%",
				},
				{
					label: "> ₦50,000,000 (Other Companies)",
					rate: "30%",
				},
				{
					label: "> ₦50,000,000 (Multinational Company)",
					rate: "30% vs 15% Min. Tax",
				},
			],
		};

		// ================= COMPUTATION TABLE =================
		this.computation = (raw.computation ?? []).map((row) => ({
			label: row.label,
			rateFormatted: `${(row.rate * 100).toFixed(0)}%`,
			taxableAmount: Math.round(row.taxableAmount ?? 0),
			tax: Math.round(row.tax ?? 0),
		}));
	}
}

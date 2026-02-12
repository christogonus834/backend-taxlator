// src/dtos/tax/citResult.dto.js
// =========================
import { BaseTaxDTO } from "./baseTax.dto.js";

// ========================= CIT RESULT DATA TRANSFER OBJECT =========================
export class CitResultDTO extends BaseTaxDTO {
	constructor(raw = {}, options = {}) {
		super({
			taxType: raw.taxType ?? options.taxType ?? "CIT",
			country: raw.country ?? options.country ?? "NG",
		});

		// ================= SUMMARY =================
		this.summary = {
			annualTurnover: Math.round(raw.annualTurnover ?? 0),
			taxableProfit: Math.round(raw.taxableProfit ?? 0),
			accountingProfit: Math.round(raw.accountingProfit ?? 0),
			totalTax: Math.round(raw.totalTax ?? 0),
			netProfitAfterTax: Math.round(raw.netProfitAfterTax ?? 0),
			appliedRate: raw.appliedRate ?? 0,
			effectiveTaxRate: raw.effectiveTaxRate ?? 0,
			minimumTaxApplied: Boolean(raw.minimumTaxApplied),
			appliedBand: raw.appliedBand ?? null,
		};

		// ================= CLASSIFICATION / BANDS =================
		this.progressive = {
			bands: (raw.progressiveTaxBands ?? []).map((band) => ({
				key: band.key,
				description: band.description,
				condition: band.condition,
				rate: band.rate,
			})),
			appliedBand: raw.appliedBand ?? null,
		};

		// ================= COMPUTATION BREAKDOWN =================
		this.computation = (raw.computation ?? []).map((row) => ({
			label: row.label,
			rate: row.rate,
			rateFormatted:
				typeof row.rate === "number"
					? `${(row.rate * 100).toFixed(0)}%`
					: String(row.rate),
			taxableAmount: Math.round(row.taxableAmount ?? 0),
			tax: Math.round(row.tax ?? 0),
			taxFormatted: this.formatNumber(Math.round(row.tax ?? 0)),
		}));
	}
}

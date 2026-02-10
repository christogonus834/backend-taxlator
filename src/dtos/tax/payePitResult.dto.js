// src/dtos/tax/payePitResult.dto.js

// ============================
import { BaseTaxDTO } from "./baseTax.dto.js";

const safeNumber = (value) =>
	typeof value === "number" && Number.isFinite(value) ? value : 0;

// ========================= PAYE/PIT RESULT DTO =========================
export class PayePitResultDTO extends BaseTaxDTO {
	constructor(raw = {}) {
		super({ taxType: "PAYE/PIT", country: "NG" });

		// ---------- Raw numeric values ----------
		this.taxableIncome = Math.round(safeNumber(raw.taxableIncome));
		this.totalAnnualTax = Math.round(safeNumber(raw.totalAnnualTax));
		this.monthlyTax = Math.round(safeNumber(raw.monthlyTax));
		this.netAnnualIncome = Math.round(safeNumber(raw.netAnnualIncome));
		this.effectiveTaxRate = Number(safeNumber(raw.effectiveTaxRate).toFixed(4));

		this.computation = Array.isArray(raw.taxBreakdown) ? raw.taxBreakdown : [];

		// ---------- Formatted ----------
		this.taxableIncomeFormatted = this.formatNumber(this.taxableIncome);
		this.totalAnnualTaxFormatted = this.formatNumber(this.totalAnnualTax);
		this.monthlyTaxFormatted = this.formatNumber(this.monthlyTax);
		this.netAnnualIncomeFormatted = this.formatNumber(this.netAnnualIncome);
		this.effectiveTaxRateFormatted = `${(this.effectiveTaxRate * 100).toFixed(
			2,
		)}%`;

		// ---------- Debug ----------
		this._raw = raw;
	}
}

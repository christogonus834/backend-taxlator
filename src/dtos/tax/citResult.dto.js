// src/dtos/tax/citResult.dto.js

// ============================
import { BaseTaxDTO } from "./baseTax.dto.js";

// ========================= CIT RESULT DATA TRANSFER OBJECT (DTO) =========================

export class CitResultDTO extends BaseTaxDTO {
	constructor(raw) {
		super({ taxType: "CIT", country: "NG" });

		// ---------- Rounded numeric values ----------
		this.taxableProfit =
			raw.taxableProfit != null ? Math.round(raw.taxableProfit) : 0;

		this.annualTurnover =
			raw.annualTurnover != null ? Math.round(raw.annualTurnover) : 0;

		this.accountingProfit =
			raw.accountingProfit != null ? Math.round(raw.accountingProfit) : 0;

		this.appliedRate = Number((raw.appliedRate ?? 0).toFixed(2));

		this.totalTax = raw.totalTax != null ? Math.round(raw.totalTax) : 0;

		this.netProfitAfterTax =
			raw.netProfitAfterTax != null ? Math.round(raw.netProfitAfterTax) : 0;

		this.minimumTaxApplied = raw.minimumTaxApplied ?? false;
		this.computation = raw.computation ?? [];

		// ---------- Formatted strings ----------
		this.taxableProfitFormatted = this.formatNumber(this.taxableProfit);
		this.annualTurnoverFormatted = this.formatNumber(this.annualTurnover);
		this.accountingProfitFormatted = this.formatNumber(this.accountingProfit);
		this.totalTaxFormatted = this.formatNumber(this.totalTax);
		this.netProfitAfterTaxFormatted = this.formatNumber(this.netProfitAfterTax);
		this.appliedRateFormatted = `${(this.appliedRate * 100).toFixed(2)}%`;

		// ---------- Keep raw for debugging ----------
		this._raw = raw;
	}
}

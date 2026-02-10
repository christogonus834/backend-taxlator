// src/dtos/tax/freelancer.dto.js

// ===========================
import { BaseTaxDTO } from "./baseTax.dto.js";

// ========================= FREELANCER TAX DATA TRANSFER OBJECT (DTO) =========================
export class FreelancerResultDTO extends BaseTaxDTO {
	constructor(freelancerResult = {}, options = {}) {
		super(options);

		// Raw calculation result from the service
		this.grossAnnualIncome = freelancerResult.grossAnnualIncome ?? 0;
		this.totalExpenses = freelancerResult.totalBusinessExpenses ?? 0;
		this.freelancerPensionContribution =
			freelancerResult.freelancerPensionContribution ?? 0;

		this.taxableIncome = freelancerResult.taxableIncome ?? 0;
		this.totalTax = freelancerResult.annualTax ?? 0;
		this.monthlyTax = freelancerResult.monthlyTax ?? 0;
		this.effectiveTaxRate = freelancerResult.effectiveTaxRate ?? 0;

		// Optionally, we could include detailed computation per band
		this.computation = freelancerResult.computation ?? [];
	}

	// ==================== FORMATTED OUTPUT ====================
	formatCurrency(amount) {
		return "₦" + this.formatNumber(amount, 0);
	}

	formatPercent(rate) {
		return this.formatNumber(rate * 100, 2) + "%";
	}
}

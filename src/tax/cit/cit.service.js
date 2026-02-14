// ==============================
// src/tax/cit/cit.service.js
// ==============================

// ==============================
import { AppError } from "../../shared/AppError.js";
// ==============================

// ======================== CIT SERVICE ========================
export function calculateCitTax({
	annualTurnover,
	fixedAssets = 0,
	taxableProfit,
	accountingProfit = 0,
	isMultinational = false,
}) {
	if (
		annualTurnover == null ||
		taxableProfit == null ||
		annualTurnover < 0 ||
		taxableProfit < 0 ||
		fixedAssets < 0
	) {
		throw new AppError(
			"annualTurnover, taxableProfit and fixedAssets must be valid numbers ≥ 0",
		);
	}

	// ================= COMPANY CLASSIFICATION =================
	const isSmallCompany =
		annualTurnover <= 50_000_000 && fixedAssets <= 250_000_000;

	let companySize = "OTHER";
	if (isSmallCompany) companySize = "SMALL";
	else if (isMultinational) companySize = "MULTINATIONAL";

	let totalTax = 0;
	let appliedRate = 0;
	let minimumTax = 0;
	let normalCIT = 0;
	let minimumTaxApplied = false;

	const computation = [];

	// ================= SMALL COMPANY =================
	if (companySize === "SMALL") {
		computation.push({
			label: "Small Company Relief (0%)",
			rate: 0,
			taxableAmount: taxableProfit,
			tax: 0,
		});
	}

	// ================= OTHER COMPANY =================
	else if (companySize === "OTHER") {
		appliedRate = 0.3;
		totalTax = taxableProfit * appliedRate;

		computation.push({
			label: "CIT (30%)",
			rate: appliedRate,
			taxableAmount: taxableProfit,
			tax: totalTax,
		});
	}

	// ================= MULTINATIONAL =================
	else if (companySize === "MULTINATIONAL") {
		normalCIT = taxableProfit * 0.3;
		minimumTax = accountingProfit * 0.15;

		totalTax = Math.max(normalCIT, minimumTax);
		minimumTaxApplied = minimumTax > normalCIT;
		appliedRate = minimumTaxApplied ? 0.15 : 0.3;

		computation.push(
			{
				label: "Normal CIT (30%)",
				rate: 0.3,
				taxableAmount: taxableProfit,
				tax: normalCIT,
			},
			{
				label: "Minimum Tax (15%)",
				rate: 0.15,
				taxableAmount: accountingProfit,
				tax: minimumTax,
			},
			{
				label: "Final Tax Payable",
				rate: appliedRate,
				taxableAmount: minimumTaxApplied ? accountingProfit : taxableProfit,
				tax: totalTax,
			},
		);
	}

	return {
		taxType: "CIT",
		country: "NIGERIA",
		companySize,
		annualTurnover,
		fixedAssets,
		taxableProfit,
		accountingProfit,
		totalTax,
		normalCIT,
		minimumTax,
		appliedRate,
		minimumTaxApplied,
		netProfitAfterTax: taxableProfit - totalTax,
		effectiveTaxRate: taxableProfit ? totalTax / taxableProfit : 0,
		computation,
	};
}

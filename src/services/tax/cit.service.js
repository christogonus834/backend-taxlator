// src/services/tax/cit.service.js

// ========================= CIT SERVICE =========================
import { AppError } from "../../errors/AppError.js";

/**
 * Calculate CIT tax
 * @param {Object} input
 * @param {number} input.taxableProfit
 * @param {number} [input.accountingProfit=0]
 * @param {number} input.annualTurnover
 * @param {number} [input.fixedAssets=0]
 * @param {boolean} [input.isMultinational=false]
 * @returns {Object} Calculation result
 */
export function calculateCitTax({
	taxableProfit,
	accountingProfit = 0,
	annualTurnover,
	fixedAssets = 0,
	isMultinational = false,
}) {
	if (taxableProfit == null || annualTurnover == null) {
		throw new AppError("taxableProfit and annualTurnover are required", 400);
	}

	// ---------- Determine applied rate ----------
	const appliedRate = isMultinational ? 0.25 : 0.3;

	// ---------- Calculate tax ----------
	const totalTax = taxableProfit * appliedRate;

	// ---------- Net profit after tax ----------
	const netProfitAfterTax = taxableProfit - totalTax;

	// ---------- Minimum tax applied rule ----------
	const minimumTaxApplied = totalTax < 50000; // example rule

	// ---------- Breakdown ----------
	const computation = [
		{
			label: "CIT",
			rate: appliedRate,
			taxableAmount: taxableProfit,
			tax: totalTax,
		},
	];

	// ---------- Return object ----------
	return {
		taxType: "CIT",
		companySize: isMultinational ? "Multinational" : "Small",
		annualTurnover,
		taxableProfit,
		accountingProfit,
		appliedRate,
		totalTax,
		netProfitAfterTax,
		minimumTaxApplied,
		computation,
		fixedAssets,
		isMultinational,
	};
}

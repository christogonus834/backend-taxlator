// src/services/tax/cit.service.js

import { AppError } from "../../errors/AppError.js";

// ======================== CIT SERVICE ========================
export function calculateCitTax({
	annualTurnover,
	fixedAssets = 0,
	taxableProfit,
	accountingProfit = 0,
	companySize,
}) {
	if (annualTurnover == null || taxableProfit == null || companySize == null) {
		throw new AppError(
			"annualTurnover, taxableProfit and companySize are required",
			400,
		);
	}

	// ================= ZERO PROFIT =================
	if (taxableProfit <= 0) {
		return {
			taxType: "CIT",
			companySize,
			annualTurnover,
			taxableProfit: 0,
			accountingProfit,
			appliedRate: 0,
			totalTax: 0,
			netProfitAfterTax: 0,
			minimumTaxApplied: false,
			effectiveTaxRate: 0,
			computation: [],
		};
	}

	let appliedRate = 0;
	let totalTax = 0;
	let minimumTaxApplied = false;
	const computation = [];

	// ================= MULTINATIONAL =================
	if (companySize === "MULTINATIONAL") {
		if (accountingProfit <= 0) {
			throw new AppError(
				"Accounting profit is required for multinational companies",
				400,
			);
		}

		const normalCIT = taxableProfit * 0.3;
		const minimumTax = accountingProfit * 0.15;

		totalTax = Math.max(normalCIT, minimumTax);
		minimumTaxApplied = minimumTax > normalCIT;
		appliedRate = 0.3;

		computation.push(
			{
				label: "Normal CIT (30%)",
				rate: 0.3,
				taxableAmount: taxableProfit,
				tax: normalCIT,
			},
			{
				label: "Minimum Tax (15% of Accounting Profit)",
				rate: 0.15,
				taxableAmount: accountingProfit,
				tax: minimumTax,
			},
		);
	}

	// ================= SMALL COMPANY =================
	else if (
		companySize === "SMALL" &&
		annualTurnover <= 100_000_000 &&
		fixedAssets <= 250_000_000
	) {
		appliedRate = 0;
		totalTax = 0;

		computation.push({
			label: "Small Company Relief",
			rate: 0,
			taxableAmount: taxableProfit,
			tax: 0,
		});
	}

	// ================= OTHER COMPANY =================
	else {
		appliedRate = 0.3;
		totalTax = taxableProfit * appliedRate;

		computation.push({
			label: "CIT (30%)",
			rate: appliedRate,
			taxableAmount: taxableProfit,
			tax: totalTax,
		});
	}

	// ================= RETURN =================
	return {
		taxType: "CIT",
		companySize,
		annualTurnover,
		taxableProfit,
		accountingProfit,
		appliedRate,
		totalTax,
		netProfitAfterTax: taxableProfit - totalTax,
		minimumTaxApplied,
		effectiveTaxRate: taxableProfit > 0 ? totalTax / taxableProfit : 0,
		computation,
	};
}

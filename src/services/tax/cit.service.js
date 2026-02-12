// src/services/tax/cit.service.js
// =========================
import { AppError } from "../../errors/AppError.js";

// ======================== CIT SERVICE ========================
export function calculateCitTax({
	annualTurnover,
	fixedAssets = 0,
	taxableProfit,
	accountingProfit = 0,
	isMultinational = false,
}) {
	if (annualTurnover == null || taxableProfit == null) {
		throw new AppError("annualTurnover and taxableProfit are required", 400);
	}

	const taxType = "CIT";
	const country = "NG";

	// ===================== CIT CLASSIFICATION BANDS =====================
	const progressiveTaxBands = [
		{
			key: "SMALL",
			condition: "Turnover ≤ ₦50,000,000 AND Assets ≤ ₦250,000,000",
			rate: 0,
			description: "Small Company (Tax Exempt)",
		},
		{
			key: "OTHER",
			condition: "Turnover > ₦50,000,000",
			rate: 0.3,
			description: "Other Companies",
		},
		{
			key: "MULTINATIONAL",
			condition: "Turnover > ₦50,000,000 (Multinational)",
			rate: "30% or 15% Minimum Tax",
			description: "Multinational Company",
		},
	];

	// ================= ZERO PROFIT =================
	if (taxableProfit <= 0) {
		return {
			taxType,
			country,
			annualTurnover,
			taxableProfit: 0,
			accountingProfit,
			appliedBand: null,
			appliedRate: 0,
			totalTax: 0,
			netProfitAfterTax: 0,
			minimumTaxApplied: false,
			effectiveTaxRate: 0,
			progressiveTaxBands,
			computation: [],
		};
	}

	const isSmallCompany =
		annualTurnover <= 50_000_000 && fixedAssets <= 250_000_000;

	let appliedBand = null;
	let appliedRate = 0;
	let totalTax = 0;
	let minimumTaxApplied = false;
	const computation = [];

	// ================= SMALL COMPANY =================
	if (isSmallCompany) {
		appliedBand = "SMALL";
		appliedRate = 0;
		totalTax = 0;

		computation.push({
			label: "Small Company Relief (0%)",
			rate: 0,
			taxableAmount: taxableProfit,
			tax: 0,
		});
	}

	// ================= MULTINATIONAL =================
	else if (isMultinational) {
		appliedBand = "MULTINATIONAL";

		const normalCIT = taxableProfit * 0.3;
		const minimumTax = accountingProfit > 0 ? accountingProfit * 0.15 : 0;

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
				label: "Minimum Tax (15% of Accounting Profit)",
				rate: 0.15,
				taxableAmount: accountingProfit,
				tax: minimumTax,
			},
		);
	}

	// ================= OTHER COMPANY =================
	else {
		appliedBand = "OTHER";
		appliedRate = 0.3;
		totalTax = taxableProfit * appliedRate;

		computation.push({
			label: "CIT (30%)",
			rate: appliedRate,
			taxableAmount: taxableProfit,
			tax: totalTax,
		});
	}

	return {
		taxType,
		country,
		annualTurnover,
		taxableProfit,
		accountingProfit,
		appliedBand,
		appliedRate,
		totalTax,
		netProfitAfterTax: taxableProfit - totalTax,
		minimumTaxApplied,
		effectiveTaxRate: taxableProfit > 0 ? totalTax / taxableProfit : 0,
		progressiveTaxBands,
		computation,
	};
}

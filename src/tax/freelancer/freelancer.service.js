// ==============================
// src/tax/freelancer/freelancer.service.js
// ==============================

// ==============================
import { AppError } from "../../shared/AppError.js";
// ==============================

// ==================== FREELANCER TAX SERVICE =====================
export function calculateFreelancerTax({
	grossAnnualIncome,
	totalBusinessExpenses = 0,
	freelancerPensionContribution = 0,
}) {
	if (grossAnnualIncome == null || grossAnnualIncome < 0) {
		throw new AppError("Gross annual income is required and must be >= 0");
	}

	// ===================== DEDUCTIONS =====================
	const totalDeductions = totalBusinessExpenses + freelancerPensionContribution;

	const taxableIncome = Math.max(grossAnnualIncome - totalDeductions, 0);

	// ===================== ZERO TAX EDGE CASE =====================
	if (taxableIncome === 0) {
		return {
			taxType: "FREELANCER",
			country: "NIGERIA",
			grossAnnualIncome,
			totalBusinessExpenses,
			freelancerPensionContribution,
			totalDeductions,
			taxableIncome: 0,
			totalAnnualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
			progressiveTaxBands: [],
			taxBreakdown: [],
			netAnnualIncome: grossAnnualIncome,
			netMonthlyIncome: grossAnnualIncome / 12,
			netIncome: grossAnnualIncome,
		};
	}

	// ===================== PROGRESSIVE TAX BANDS =====================
	const progressiveTaxBands = [
		{ limit: 800_000, rate: 0, label: "First ₦800,000" },
		{ limit: 2_200_000, rate: 0.15, label: "Next ₦2,200,000" },
		{ limit: 9_000_000, rate: 0.18, label: "Next ₦9,000,000" },
		{ limit: 13_000_000, rate: 0.21, label: "Next ₦13,000,000" },
		{ limit: 25_000_000, rate: 0.23, label: "Next ₦25,000,000" },
		{ limit: Infinity, rate: 0.25, label: "Above ₦50,000,000" },
	];

	let remainingIncome = taxableIncome;
	let totalAnnualTax = 0;
	const taxBreakdown = [];

	for (const band of progressiveTaxBands) {
		if (remainingIncome <= 0) break;

		const taxableAmount = Math.round(Math.min(remainingIncome, band.limit));

		const tax = Math.round(taxableAmount * band.rate);

		totalAnnualTax += tax;

		taxBreakdown.push({
			label: band.label,
			rate: band.rate,
			rateFormatted: `${(band.rate * 100).toFixed(0)}%`,
			taxableAmount,
			tax,
			taxFormatted: `₦${tax.toLocaleString()}`,
		});

		remainingIncome -= taxableAmount;
	}

	const monthlyTax = Math.round(totalAnnualTax / 12);
	const effectiveTaxRate =
		grossAnnualIncome === 0 ? 0 : totalAnnualTax / grossAnnualIncome;

	const netAnnualIncome = grossAnnualIncome - totalAnnualTax;
	const netMonthlyIncome = Math.round(netAnnualIncome / 12);

	return {
		taxType: "FREELANCER",
		country: "NIGERIA",
		grossAnnualIncome,
		totalBusinessExpenses,
		freelancerPensionContribution,
		totalDeductions,
		taxableIncome,
		totalAnnualTax,
		monthlyTax,
		effectiveTaxRate,
		progressiveTaxBands,
		taxBreakdown,
		netAnnualIncome,
		netMonthlyIncome,
		netIncome: netAnnualIncome,
	};
}

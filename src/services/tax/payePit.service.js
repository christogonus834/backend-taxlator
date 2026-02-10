// src/services/tax/payePit.service.js

import { AppError } from "../../errors/AppError.js";

// ======================= PAYE / PIT SERVICE =======================
export function calculatePayePit({
	grossAnnualIncome,
	payePitPensionContribution = true,
	nationalHealthInsuranceScheme = true,
	nationalHousingFund = true,
	otherDeductions = 0,
}) {
	if (grossAnnualIncome == null || grossAnnualIncome < 0) {
		throw new AppError("Gross annual income is required and must be >= 0");
	}

	// ===================== FIXED DEDUCTIONS =====================
	const rentRelief = grossAnnualIncome * 0.2; // 20%
	const pension = payePitPensionContribution ? grossAnnualIncome * 0.08 : 0;
	const nhis = nationalHealthInsuranceScheme ? grossAnnualIncome * 0.05 : 0;
	const nhf = nationalHousingFund ? grossAnnualIncome * 0.025 : 0;

	const deductions = {
		rentRelief,
		pension,
		nhis,
		nhf,
		otherDeductions,
	};

	const totalDeductions = rentRelief + pension + nhis + nhf + otherDeductions;

	const taxableIncome = Math.max(grossAnnualIncome - totalDeductions, 0);

	// ===================== ZERO TAX EDGE CASE =====================
	if (taxableIncome === 0) {
		return {
			taxType: "PAYE/PIT",

			// Deductions
			deductions,
			totalDeductions,

			// Income
			taxableIncome,

			// Tax
			totalAnnualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,

			// Bands & breakdown
			progressiveTaxBands: [],
			taxBreakdown: [],

			// Net
			netAnnualIncome: grossAnnualIncome,
			netMonthlyIncome: grossAnnualIncome / 12,
			netIncome: grossAnnualIncome,
		};
	}

	// ===================== PROGRESSIVE TAX BANDS =====================
	const progressiveTaxBands = [
		{ limit: 300_000, rate: 0.07, label: "First ₦300,000" },
		{ limit: 300_000, rate: 0.11, label: "Next ₦300,000" },
		{ limit: 500_000, rate: 0.15, label: "Next ₦500,000" },
		{ limit: 500_000, rate: 0.19, label: "Next ₦500,000" },
		{ limit: 1_600_000, rate: 0.21, label: "Next ₦1,600,000" },
		{ limit: 3_200_000, rate: 0.24, label: "Next ₦3,200,000" },
		{ limit: Infinity, rate: 0.24, label: "Above ₦6,400,000" },
	];

	let remainingIncome = taxableIncome;
	let totalAnnualTax = 0;
	const taxBreakdown = [];

	for (const band of progressiveTaxBands) {
		if (remainingIncome <= 0) break;

		const taxableAmount = Math.min(remainingIncome, band.limit);
		const tax = taxableAmount * band.rate;

		totalAnnualTax += tax;

		taxBreakdown.push({
			limit: band.limit,
			rate: band.rate,
			taxableAmount,
			tax,
			label: band.label,
		});

		remainingIncome -= taxableAmount;
	}

	// ===================== FINAL CALCULATIONS =====================
	const monthlyTax = totalAnnualTax / 12;
	const effectiveTaxRate = totalAnnualTax / grossAnnualIncome;
	const netAnnualIncome = grossAnnualIncome - totalAnnualTax;
	const netMonthlyIncome = netAnnualIncome / 12;

	return {
		grossAnnualIncome,
		deductions,
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

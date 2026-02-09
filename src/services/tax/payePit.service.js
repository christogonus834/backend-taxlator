// src/services/tax/payePit.service.js

// =========================
import { AppError } from "../../errors/AppError.js";

// ===================== PAYE/PIT SERVICE =====================
export function calculatePayePit({
	grossAnnualIncome,
	payePitPensionContribution = true,
	nationalHealthInsuranceScheme = true,
	nationalHousingFund = true,
	rentRelief = 0,
	otherDeductions = 0,
}) {
	if (grossAnnualIncome == null || grossAnnualIncome < 0) {
		throw new AppError("Gross annual income must be a positive number", 400);
	}

	// ---------- Mandatory deductions ----------
	const pension = payePitPensionContribution ? grossAnnualIncome * 0.08 : 0;
	const nhis = nationalHealthInsuranceScheme ? grossAnnualIncome * 0.05 : 0;
	const nhf = nationalHousingFund ? grossAnnualIncome * 0.025 : 0;

	const totalDeductions = pension + nhis + nhf + rentRelief + otherDeductions;

	// ---------- Taxable income ----------
	const taxableIncome = Math.max(grossAnnualIncome - totalDeductions, 0);

	if (taxableIncome === 0) {
		return {
			taxableIncome: 0,
			totalTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
			totalDeductions,
		};
	}

	// ---------- Nigeria PAYE progressive bands ----------
	const bands = [
		{ limit: 300_000, rate: 0.07 },
		{ limit: 300_000, rate: 0.11 },
		{ limit: 500_000, rate: 0.15 },
		{ limit: 500_000, rate: 0.19 },
		{ limit: 1_600_000, rate: 0.21 },
		{ limit: 3_200_000, rate: 0.24 },
		{ limit: Infinity, rate: 0.24 },
	];

	let remainingIncome = taxableIncome;
	let totalTax = 0;
	const computation = [];

	for (const band of bands) {
		if (remainingIncome <= 0) break;

		const taxableAtBand = Math.min(remainingIncome, band.limit);
		const taxAtBand = taxableAtBand * band.rate;

		totalTax += taxAtBand;
		computation.push({
			limit: band.limit,
			rate: band.rate,
			taxableAmount: taxableAtBand,
			tax: taxAtBand,
		});

		remainingIncome -= taxableAtBand;
	}

	const monthlyTax = totalTax / 12;
	const effectiveTaxRate =
		grossAnnualIncome === 0 ? 0 : totalTax / grossAnnualIncome;
	const netIncome = grossAnnualIncome - totalTax;

	return {
		taxableIncome,
		totalTax,
		monthlyTax,
		effectiveTaxRate,
		netIncome,
		totalDeductions,
		computation,
	};
}

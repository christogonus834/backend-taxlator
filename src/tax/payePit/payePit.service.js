// ===============================
// src/tax/payePit/payePit.service.js
// ===============================

// ===============================
import { AppError } from "../../shared/AppError.js";
// ===============================

// ===================== PAYE/PIT CALCULATION SERVICE =====================
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
	const rentRelief = Math.round(grossAnnualIncome * 0.2);
	const pension = payePitPensionContribution
		? Math.round(grossAnnualIncome * 0.08)
		: 0;
	const nhis = nationalHealthInsuranceScheme
		? Math.round(grossAnnualIncome * 0.05)
		: 0;
	const nhf = nationalHousingFund ? Math.round(grossAnnualIncome * 0.025) : 0;

	const deductions = { rentRelief, pension, nhis, nhf, otherDeductions };
	const totalDeductions = rentRelief + pension + nhis + nhf + otherDeductions;

	const taxableIncome = Math.max(grossAnnualIncome - totalDeductions, 0);

	// ===================== ZERO TAX EDGE CASE =====================
	if (taxableIncome === 0) {
		return {
			taxType: "PAYE/PIT",
			country: "NIGERIA",
			grossAnnualIncome,
			deductions,
			totalDeductions,
			taxableIncome,
			totalAnnualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
			progressiveTaxBands: [],
			taxBreakdown: [],
			netAnnualIncome: grossAnnualIncome,
			netMonthlyIncome: Math.round(grossAnnualIncome / 12),
			netIncome: grossAnnualIncome,
		};
	}

	// ===================== PROGRESSIVE TAX BANDS =====================
	const progressiveTaxBandsTemplate = [
		{ limit: 800_000, rate: 0, label: "First ₦800,000" },
		{ limit: 3_000_000, rate: 0.15, label: "Next ₦2,200,000" },
		{ limit: 12_000_000, rate: 0.18, label: "Next ₦9,000,000" },
		{ limit: 25_000_000, rate: 0.21, label: "Next ₦13,000,000" },
		{ limit: 50_000_000, rate: 0.23, label: "Next ₦25,000,000" },
		{ limit: Infinity, rate: 0.25, label: "Above ₦50,000,000" },
	];

	let remainingIncome = taxableIncome;
	let totalAnnualTax = 0;
	const taxBreakdown = [];

	for (let i = 0; i < progressiveTaxBandsTemplate.length; i++) {
		const band = progressiveTaxBandsTemplate[i];
		const prevLimit = i === 0 ? 0 : progressiveTaxBandsTemplate[i - 1].limit;

		if (remainingIncome <= 0) break;

		const bandRange = band.limit - prevLimit;
		const taxableAmount = Math.min(remainingIncome, bandRange);
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
	const netAnnualIncome = grossAnnualIncome - totalAnnualTax;
	const netMonthlyIncome = Math.round(netAnnualIncome / 12);
	const effectiveTaxRate = totalAnnualTax / grossAnnualIncome;

	return {
		taxType: "PAYE/PIT",
		country: "NIGERIA",
		grossAnnualIncome,
		deductions,
		totalDeductions,
		taxableIncome,
		totalAnnualTax,
		monthlyTax,
		effectiveTaxRate,
		progressiveTaxBands: progressiveTaxBandsTemplate,
		taxBreakdown,
		netAnnualIncome,
		netMonthlyIncome,
		netIncome: netAnnualIncome,
	};
}

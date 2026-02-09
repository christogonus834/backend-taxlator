// src/services/tax/freelancer.service.js

// =========================
import { AppError } from "../../errors/AppError.js";

// ==================== FREELANCER TAX SERVICE =====================
export function calculateFreelancerTax({
	grossAnnualIncome,
	totalBusinessExpenses = 0,
	freelancerPensionContribution = 0,
}) {
	if (grossAnnualIncome == null || grossAnnualIncome < 0) {
		throw new AppError("Gross annual income must be a positive number", 400);
	}

	// ===================== Taxable income =====================
	const taxableIncome = Math.max(
		grossAnnualIncome - totalBusinessExpenses - freelancerPensionContribution,
		0,
	);

	if (taxableIncome === 0) {
		return {
			taxableIncome: 0,
			annualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
		};
	}

	// ===================== Progressive tax bands =====================
	const TAX_BANDS = [
		{ limit: 800_000, rate: 0 },
		{ limit: 3_000_000, rate: 0.15 },
		{ limit: 12_000_000, rate: 0.18 },
		{ limit: 25_000_000, rate: 0.21 },
		{ limit: 50_000_000, rate: 0.23 },
		{ limit: Infinity, rate: 0.25 },
	];

	let remainingIncome = taxableIncome;
	let annualTax = 0;
	let previousLimit = 0;

	for (const band of TAX_BANDS) {
		if (remainingIncome <= 0) break;

		const bandSize = band.limit - previousLimit;
		const taxableAtThisBand = Math.min(remainingIncome, bandSize);

		annualTax += taxableAtThisBand * band.rate;

		remainingIncome -= taxableAtThisBand;
		previousLimit = band.limit;
	}

	const monthlyTax = annualTax / 12;
	const effectiveTaxRate =
		grossAnnualIncome === 0 ? 0 : annualTax / grossAnnualIncome;

	return {
		taxableIncome,
		annualTax,
		monthlyTax,
		effectiveTaxRate,
	};
}

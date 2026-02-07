// src/services/tax/freelancer.service.js

// =========================
import { AppError } from "../../errors/AppError.js";

// ==================== FREELANCER TAX SERVICE =====================
export function calculateFreelancerTax({
	grossAnnualIncome,
	rentRelief = 0,
	otherDeductions = 0,
}) {
	if (grossAnnualIncome == null || grossAnnualIncome < 0) {
		throw new AppError("Gross annual income must be a positive number", 400);
	}

	const taxableIncome = grossAnnualIncome - rentRelief - otherDeductions;

	if (taxableIncome <= 0) {
		return {
			taxableIncome: 0,
			annualTax: 0,
			monthlyTax: 0,
			effectiveTaxRate: 0,
		};
	}

	const bands = [
		{ limit: 300000, rate: 0.07 },
		{ limit: 300000, rate: 0.11 },
		{ limit: 500000, rate: 0.15 },
		{ limit: 500000, rate: 0.19 },
		{ limit: 1600000, rate: 0.21 },
		{ limit: 3200000, rate: 0.24 },
		{ limit: Infinity, rate: 0.24 },
	];

	let remainingIncome = taxableIncome;
	let annualTax = 0;

	for (const band of bands) {
		const taxableAtBand = Math.min(remainingIncome, band.limit);
		annualTax += taxableAtBand * band.rate;
		remainingIncome -= taxableAtBand;
		if (remainingIncome <= 0) break;
	}

	const monthlyTax = annualTax / 12;
	const effectiveTaxRate = annualTax / taxableIncome;

	return {
		taxableIncome,
		annualTax,
		monthlyTax,
		effectiveTaxRate,
	};
}

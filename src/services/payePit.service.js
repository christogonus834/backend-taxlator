// src/services/paye.service.js
const PAYE_TAX_BANDS = require("../utils/taxBands");
// -----------------------

/**
 * Calculate PAYE Tax (Nigeria)
 */
exports.calculatePAYE = async ({
	grossIncome,
	otherDeductions = 0,
	includePension = true,
	includeNhf = true,
	includeNhIs = true,
}) => {
	const deductions = {};

	// Fixed statutory deductions
	deductions["Rent Relief Deduction (20%)"] = grossIncome * 0.2;

	if (includePension) deductions["Pension Deduction (8%)"] = grossIncome * 0.08;

	if (includeNhIs)
		deductions["National Health Insurance Scheme Deduction (5%)"] =
			grossIncome * 0.05;

	if (includeNhf)
		deductions["National Housing Fund (2.5%)"] = grossIncome * 0.025;

	if (otherDeductions > 0) deductions["Other Expenses"] = otherDeductions;

	const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);

	const taxableIncome = grossIncome - totalDeductions;

	const initialExempt = Math.min(800000, taxableIncome);
	const taxableRemaining = Math.max(0, taxableIncome - initialExempt);

	// Progressive tax
	const bands = [
		{ limit: 800000, rate: 0 },
		{ limit: 3000000, rate: 0.15 },
		{ limit: 12000000, rate: 0.18 },
		{ limit: 25000000, rate: 0.21 },
		{ limit: 50000000, rate: 0.23 },
		{ limit: Infinity, rate: 0.25 },
	];

	let remaining = taxableIncome;
	let tax = 0;
	const steps = [];

	let lastLimit = 0;
	for (const band of bands) {
		if (remaining <= 0) break;

		const taxableAtBand = Math.min(band.limit - lastLimit, remaining);
		const bandTax = taxableAtBand * band.rate;

		if (taxableAtBand > 0) {
			steps.push({
				label:
					band.rate === 0
						? `First ₦${band.limit.toLocaleString()}`
						: `Tax ${band.rate * 100}% of ₦${taxableAtBand.toLocaleString()}`,
				amount: bandTax,
			});
		}

		tax += bandTax;
		remaining -= taxableAtBand;
		lastLimit = band.limit;
	}

	return {
		grossIncome,
		netIncome: grossIncome - tax,
		totalDeductions,
		taxableIncome,
		initialExempt,
		taxableRemaining,
		deductions,
		totalTax: tax,
		taxBands: [
			{ label: "₦0 - ₦800,000", rate: "0%" },
			{ label: "₦800,001 - ₦3,000,000", rate: "15%" },
			{ label: "₦3,000,001 - ₦12,000,000", rate: "18%" },
			{ label: "₦12,000,001 - ₦25,000,000", rate: "21%" },
			{ label: "₦25,000,001 - ₦50,000,000", rate: "23%" },
			{ label: "Above ₦50,000,000", rate: "25%" },
		],
		computation: steps,
	};
};
// src/services/payePit.service.js

/**
 * PAYE / PIT Calculator (Nigeria - PITA)
 * Pension = automatic 8% of annual income (not optional)
 */

const round2 = (n) => Math.round(n * 100) / 100;
const toNumber = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

exports.calculatePAYE = async ({
	grossIncome,
	frequency = "annual",
	includeNhIs = true,
	includeNhf = true,
	annualRent = 0,
	otherDeductions = 0,
}) => {
	// -------------------------
	// NORMALIZE INCOME
	// -------------------------
	const annualIncome =
		frequency === "monthly"
			? toNumber(grossIncome) * 12
			: toNumber(grossIncome);

	// -------------------------
	// DEDUCTIONS
	// -------------------------
	const deductions = {
		pension: {
			key: "pension",
			label: "Pension Contribution (8%)",
			rate: 0.08,
			amount: round2(annualIncome * 0.08),
		},
		nhis: {
			key: "nhis",
			label: "National Health Insurance (5%)",
			rate: 0.05,
			enabled: Boolean(includeNhIs),
			amount: includeNhIs ? round2(annualIncome * 0.05) : 0,
		},
		nhf: {
			key: "nhf",
			label: "National Housing Fund (2.5%)",
			rate: 0.025,
			enabled: Boolean(includeNhf),
			amount: includeNhf ? round2(annualIncome * 0.025) : 0,
		},
		rentRelief: {
			key: "rentRelief",
			label: "Rent Relief (20% of Annual Rent)",
			rate: 0.2,
			base: toNumber(annualRent),
			amount: toNumber(annualRent) > 0 ? round2(toNumber(annualRent) * 0.2) : 0,
		},
		other: {
			key: "other",
			label: "Other Deductions",
			amount: round2(toNumber(otherDeductions)),
		},
	};

	const deductionsList = Object.values(deductions)
		.filter((d) => d.amount > 0)
		.map((d) => ({
			key: d.key,
			label: d.label,
			amount: d.amount,
			...(d.rate != null ? { rate: d.rate } : {}),
			...(d.base != null ? { base: d.base } : {}),
			...(d.enabled != null ? { enabled: d.enabled } : {}),
		}));

	const totalDeductions = round2(
		deductionsList.reduce((sum, d) => sum + d.amount, 0),
	);

	// -------------------------
	// CONSOLIDATED RELIEF ALLOWANCE
	// CRA = 20% of income + ₦200,000
	// -------------------------
	const CRA = round2(annualIncome * 0.2 + 200000);

	// -------------------------
	// TAXABLE INCOME
	// -------------------------
	const taxableIncome = Math.max(
		round2(annualIncome - CRA - totalDeductions),
		0,
	);

	// -------------------------
	// PAYE TAX BANDS
	// -------------------------
	const bands = [
		{ limit: 300000, rate: 0.07 },
		{ limit: 300000, rate: 0.11 },
		{ limit: 500000, rate: 0.15 },
		{ limit: 500000, rate: 0.19 },
		{ limit: 1600000, rate: 0.21 },
		{ limit: Infinity, rate: 0.24 },
	];

	let remaining = taxableIncome;
	let totalTax = 0;
	const computation = [];

	for (const band of bands) {
		if (remaining <= 0) break;

		const taxableAtBand = Math.min(remaining, band.limit);
		const taxForBand = round2(taxableAtBand * band.rate);

		computation.push({
			rate: band.rate,
			taxableAmount: taxableAtBand,
			tax: taxForBand,
		});

		totalTax += taxForBand;
		remaining -= taxableAtBand;
	}

	totalTax = round2(totalTax);

	const effectiveTaxRate =
		annualIncome > 0 ? round2(totalTax / annualIncome) : 0;

	// -------------------------
	// RESPONSE
	// -------------------------
	return {
		taxType: "PAYE/PIT",
		frequency,
		grossIncome: annualIncome,
		cra: CRA,
		deductions: deductionsList,
		totalDeductions,
		taxableIncome,
		totalTax: Math.round(totalTax),
		netIncome: Math.round(annualIncome - totalTax),
		effectiveTaxRate,
		computation,
	};
};

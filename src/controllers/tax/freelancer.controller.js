// src/controllers/tax/freelancer.controller.js
// =========================

import { calculateFreelancerTax } from "../services/taxCalculator/freelancer.service.js";
import TaxRecord from "../../../models/tax/records/taxRecord.Model.js";

// ===================== FREELANCER CONTROLLER =====================
export async function calculateFreelancerTax(req, res) {
	try {
		const {
			grossAnnualIncome,
			totalBusinessExpenses,
			freelancerPensionContribution,
			notes,
		} = req.body;

		if (!grossAnnualIncome) {
			return res.status(400).json({
				success: false,
				message: "grossAnnualIncome is required",
			});
		}

		// ==================== Calculate tax ====================
		const result = calculateFreelancer({
			grossAnnualIncome,
			totalBusinessExpenses,
			freelancerPensionContribution,
		});

		// ==================== Save record =====================
		const record = await TaxRecord.create({
			userId: req.user._id,
			taxType: "FREELANCER",
			taxableIncome: result.taxableIncome,
			annualTax: result.taxAmount,
			monthlyTax: result.monthlyTax,
			effectiveTaxRate: result.effectiveTaxRate,
			inputSnapshot: req.body,
			notes,
		});

		return res.status(200).json({
			success: true,
			data: record,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

// src/controllers/tax/payePit.controller.js
// =========================

import { calculatePayePit } from "../services/taxCalculator/payePit.service.js";
import TaxRecord from "../../../models/tax/records/taxRecord.Model.js";

// ===================== PAYE/PIT CONTROLLER =====================

export async function calculatePayePitTax(req, res) {
	try {
		const { grossAnnualIncome, otherDeductions, notes } = req.body;

		if (!grossAnnualIncome) {
			return res.status(400).json({
				success: false,
				message: "grossAnnualIncome is required",
			});
		}

		// ==================== Calculate tax ====================
		const result = calculatePayePit({
			grossAnnualIncome,
			otherDeductions,
		});

		// ==================== Save record =====================
		const record = await TaxRecord.create({
			userId: req.user._id,
			taxType: "PAYE/PIT",
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

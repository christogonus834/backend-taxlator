// src/controllers/tax/cit.controller.js
// =========================

import { calculateCitTax } from "../../../services/tax/cit.service.js";
import TaxRecord from "../../../models/tax/records/taxRecord.Model.js";

// ===================== CIT CONTROLLER =====================
export async function calculateCit(req, res) {
	try {
		const { taxableProfit, accountingProfit, companySize, notes } = req.body;

		if (!taxableProfit || !companySize) {
			return res.status(400).json({
				success: false,
				message: "taxableProfit and companySize are required",
			});
		}

		// Multinational requires accounting profit
		if (companySize === "multinational" && !accountingProfit) {
			return res.status(400).json({
				success: false,
				message: "accountingProfit is required for multinational companies",
			});
		}

		// ==================== Calculate tax ====================
		const result = calculateCitTax({
			taxableProfit,
			accountingProfit,
			companySize,
		});

		// ==================== Save record =====================
		const record = await TaxRecord.create({
			userId: req.user._id,
			taxType: "CIT",
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

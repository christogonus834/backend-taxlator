// src/controllers/tax/cit/cit.auth.controller.js
// =========================

import { calculateCitTax } from "../../../services/tax/cit.service.js";
import TaxRecord from "../../../models/tax/taxRecords/taxRecord.Model.js";
import { CitResultDTO } from "../../../dtos/tax/citResult.dto.js";

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculateCitAuth(req, res, next) {
	try {
		const {
			taxableProfit,
			accountingProfit = 0,
			annualTurnover,
			fixedAssets = 0,
			isMultinational = false,
			notes,
		} = req.body;

		const result = calculateCitTax({
			taxableProfit,
			accountingProfit,
			annualTurnover,
			fixedAssets,
			isMultinational,
		});

		const record = await TaxRecord.create({
			userId: req.user._id,
			taxType: "CIT",
			taxableIncome: result.taxableProfit,
			annualTax: result.totalTax,
			monthlyTax: Math.round(result.totalTax / 12),
			effectiveTaxRate: result.appliedRate,
			inputSnapshot: req.body,
			notes,
		});

		const dto = new CitResultDTO(result, {
			decimals: 0,
			taxType: "CIT",
			country: "NG",
		});

		return res.status(201).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

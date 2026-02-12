// src/controllers/tax/cit/cit.auth.controller.js
// =========================
import { calculateCitTax } from "../../../services/tax/cit.service.js";
import TaxRecord from "../../../models/tax/taxRecords/taxRecord.Model.js";
import { CitResultDTO } from "../../../dtos/tax/citResult.dto.js";

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculateCitAuth(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		// ===================== CALCULATION =====================
		const result = calculateCitTax(input);

		// ===================== SAVE RECORD =====================
		const record = await TaxRecord.create({
			userId: req.user._id,
			taxType: "CIT",
			taxableIncome: result.taxableProfit,
			annualTax: result.totalTax,
			monthlyTax: +(result.totalTax / 12).toFixed(0),
			effectiveTaxRate: result.effectiveTaxRate,
			inputSnapshot: input,
			notes,
		});

		// ===================== DTO =====================
		const dto = new CitResultDTO(result);

		return res.status(201).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

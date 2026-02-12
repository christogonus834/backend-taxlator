// src/controllers/tax/payePit/payePit.auth.controller.js

// =====================
import { calculatePayePit } from "../../../services/tax/payePit.service.js";
import TaxRecord from "../../../models/tax/taxRecords/taxRecord.Model.js";
import { PayePitResultDTO } from "../../../dtos/tax/payePitResult.dto.js";

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculatePayePitAuth(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		// ===================== CALCULATION =====================
		const result = calculatePayePit(input);

		// ===================== SAVE RECORD =====================
		const record = await TaxRecord.create({
			userId: req.user._id,
			taxType: result.taxType,
			taxableIncome: result.taxableIncome,
			annualTax: result.totalAnnualTax,
			monthlyTax: result.monthlyTax,
			effectiveTaxRate: result.effectiveTaxRate,
			inputSnapshot: input,
			outputSnapshot: result,
			notes,
		});

		// ===================== DTO =====================
		const dto = new PayePitResultDTO(result);

		return res.status(201).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

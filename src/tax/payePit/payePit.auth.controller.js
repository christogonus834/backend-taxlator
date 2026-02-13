// ============================
// src/controllers/tax/payePit/payePit.auth.controller.js
// ============================

// ============================
import { calculatePayePit } from "./payePit.service.js";
import { PayePitResultDTO } from "./payePitResult.dto.js";
import TaxRecord from "../taxRecord.Model.js";
import History from "../../history/history.model.js";
// ============================

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

		// ===================== HISTORY =====================
		await History.create({
			userId: req.user._id,
			type: "PAYE/PIT",
			input,
			result,
			recordId: record._id,
		});

		return res.status(201).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

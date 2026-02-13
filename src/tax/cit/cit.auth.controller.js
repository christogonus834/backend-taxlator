// ============================
// src/controllers/tax/cit/cit.auth.controller.js
// =========================

// ============================
import { calculateCitTax } from "./cit.service.js";
import { CitResultDTO } from "./citResult.dto.js";
import TaxRecord from "../taxRecord.Model.js";
import { logHistory } from "../../history/history.service.js";
// ============================

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

		// ===================== HISTORY =====================
		await logHistory({
			userId: req.user._id,
			type: "CIT",
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

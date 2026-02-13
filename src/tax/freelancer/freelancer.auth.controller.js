// ============================
// src/controllers/tax/freelancer/freelancer.auth.controller.js
// ============================

// ============================
import { calculateFreelancerTax } from "./freelancer.service.js";
import { FreelancerResultDTO } from "./freelancerResult.dto.js";
import TaxRecord from "../taxRecord.Model.js";
import History from "../../history/history.model.js";
// ============================

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculateFreelancerAuth(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		// ===================== CALCULATION =====================
		const result = calculateFreelancerTax(input);

		// ===================== SAVE RECORD =====================
		await TaxRecord.create({
			userId: req.user._id,
			taxType: result.taxType,
			country: result.country,
			taxableIncome: result.taxableIncome,
			totalAnnualTax: result.totalAnnualTax,
			monthlyTax: result.monthlyTax,
			effectiveTaxRate: result.effectiveTaxRate,
			inputSnapshot: input,
			outputSnapshot: result,
			notes,
		});

		// ===================== DTO =====================
		const dto = new FreelancerResultDTO(result);

		// ===================== HISTORY =====================
		await History.create({
			userId: req.user._id,
			type: "FREELANCER",
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

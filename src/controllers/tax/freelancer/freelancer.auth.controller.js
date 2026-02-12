// src/controllers/tax/freelancer/freelancer.auth.controller.js
// ============================
import { calculateFreelancerTax } from "../../../services/tax/freelancer.service.js";
import TaxRecord from "../../../models/tax/taxRecords/taxRecord.Model.js";
import { FreelancerResultDTO } from "../../../dtos/tax/freelancer.dto.js";

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

		return res.status(201).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

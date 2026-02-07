// src/controllers/tax/freelancer/freelancer.auth.controller.js

// =========================
import { calculateFreelancerTax } from "../../../services/tax/freelancer.service.js";
import TaxRecord from "../../../models/tax/taxRecords/taxRecord.Model.js";
import { TaxResultDTO } from "../../../dtos/taxResult.dto.js";

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculateFreelancerAuth(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		const result = calculateFreelancerTax(input);

		const record = await TaxRecord.create({
			userId: req.user._id,
			taxType: "FREELANCER",
			taxableIncome: result.taxableIncome,
			annualTax: result.annualTax,
			monthlyTax: result.monthlyTax,
			effectiveTaxRate: result.effectiveTaxRate,
			inputSnapshot: input,
			notes,
		});

		const dto = new TaxResultDTO(result, {
			decimals: 0,
			taxType: "FREELANCER",
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

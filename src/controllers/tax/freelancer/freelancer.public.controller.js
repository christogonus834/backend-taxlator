// src/controllers/tax/freelancer.public.controller.js

// =========================
import { calculateFreelancerTax } from "../../../services/tax/freelancer.service.js";
import { FreelancerResultDTO } from "../../../dtos/tax/freelancer.dto.js";

// ===================== PUBLIC: CALCULATE ONLY =====================
export async function calculateFreelancerPublic(req, res, next) {
	try {
		const result = calculateFreelancerTax(req.body);

		const dto = new FreelancerResultDTO(result, {
			decimals: 0,
			taxType: "FREELANCER",
			country: "NG",
		});

		return res.status(200).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

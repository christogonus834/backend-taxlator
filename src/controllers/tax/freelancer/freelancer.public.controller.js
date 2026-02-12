// src/controllers/tax/freelancer/freelancer.public.controller.js
// =====================
import { calculateFreelancerTax } from "../../../services/tax/freelancer.service.js";
import { FreelancerResultDTO } from "../../../dtos/tax/freelancer.dto.js";

// ===================== PUBLIC: CALCULATE ONLY =====================
export async function calculateFreelancerPublic(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		// ===================== CALCULATION =====================
		const result = calculateFreelancerTax(input);

		// ===================== DTO =====================
		const dto = new FreelancerResultDTO(result);

		return res.status(200).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

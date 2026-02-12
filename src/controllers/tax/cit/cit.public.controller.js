// src/controllers/tax/cit/cit.public.controller.js
// =========================
import { calculateCitTax } from "../../../services/tax/cit.service.js";
import { AppError } from "../../../errors/AppError.js";
import { CitResultDTO } from "../../../dtos/tax/citResult.dto.js";

// ===================== PUBLIC: CALCULATE ONLY =====================
export async function calculateCitPublic(req, res, next) {
	try {
		// Extract notes separately (not needed for calculation)
		const { notes, ...input } = req.body;

		// ===================== CALCULATION =====================
		const result = calculateCitTax(input);

		// ===================== DTO TRANSFORMATION =====================
		const dto = new CitResultDTO(result);

		return res.status(200).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

// ============================
// src/controllers/tax/cit/cit.public.controller.js
// =========================

// ============================
import { calculateCitTax } from "./cit.service.js";
import { CitResultDTO } from "./citResult.dto.js";
// ============================

// ===================== PUBLIC: CALCULATE ONLY =====================
export async function calculateCitPublic(req, res, next) {
	try {
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

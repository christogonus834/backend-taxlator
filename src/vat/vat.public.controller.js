// ================================
// src/vat/vat.auth.controller.js
// ================================

// ================================
import { calculateVat } from "./vat.service.js";
import { VATResultDTO } from "../vat/vatResult.dto.js";
// ================================

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculateVatPublic(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		// ===================== CALCULATION =====================
		const result = calculateVat(input);

		// ===================== DTO =====================
		const dto = new VATResultDTO(result);

		return res.status(200).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

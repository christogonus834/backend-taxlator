// src/controllers/tax/payePit/payePit.public.controller.js

// =====================
import { calculatePayePit } from "../../../services/tax/payePit.service.js";
import { PayePitResultDTO } from "../../../dtos/tax/payePitResult.dto.js";

// ===================== PUBLIC: CALCULATE ONLY =====================
export async function calculatePayePitPublic(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		// ===================== CALCULATION =====================
		const result = calculatePayePit(input);

		// ===================== DTO =====================
		const dto = new PayePitResultDTO(result);

		return res.status(200).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		console.error("PAYE/PIT calculation error:", error);
		next(error);
	}
}

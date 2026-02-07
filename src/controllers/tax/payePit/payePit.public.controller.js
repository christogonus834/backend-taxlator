// src/controllers/tax/payePit/payePit.public.controller.js

// =========================
import { calculatePayePit } from "../../../services/tax/payePit.service.js";
import { TaxResultDTO } from "../../../dtos/taxResult.dto.js";

// ===================== PUBLIC: CALCULATE ONLY =====================
export async function calculatePayePitPublic(req, res, next) {
	try {
		const result = calculatePayePit(req.body);

		const dto = new TaxResultDTO(result, {
			decimals: 0,
			taxType: "PAYE/PIT",
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

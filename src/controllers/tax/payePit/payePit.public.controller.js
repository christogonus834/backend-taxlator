// src/controllers/tax/payePit/payePit.public.controller.js

// =====================
import { calculatePayePit } from "../../../services/tax/payePit.service.js";
import { PayePitResultDTO } from "../../../dtos/tax/payePitResult.dto.js";

// ===================== PUBLIC: CALCULATE ONLY =====================
export async function calculatePayePitPublic(req, res, next) {
	try {
		console.log("=== PAYE/PIT Public Calculation Request ===");
		console.log("Request body:", req.body);

		// ===================== CALCULATION =====================
		const result = calculatePayePit(req.body);
		console.log("Raw calculation result:", result);

		// ===================== DTO TRANSFORMATION =====================
		const dto = new PayePitResultDTO({
			...result,
			decimals: 0, 
		});

		console.log("DTO result sent to frontend:", dto);

		return res.status(200).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		console.error("PAYE/PIT calculation error:", error);
		next(error);
	}
}

import { calculatePayePit } from "../../../services/tax/payePit.service.js";
import { TaxResultDTO } from "../../../dtos/tax/citResult.dto.js";

export async function calculatePayePitPublic(req, res, next) {
	try {
		console.log("=== PAYE/PIT Public Calculation Request ===");
		console.log("Request body:", req.body);

		const result = calculatePayePit(req.body);

		console.log("Raw calculation result:", result);

		const dto = new TaxResultDTO(result, {
			decimals: 0,
			taxType: "PAYE/PIT",
			country: "NG",
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

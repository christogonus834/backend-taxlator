// src/controllers/tax/payePit/payePit.auth.controller.js

// =========================
import { calculatePayePit } from "../../../services/tax/payePit.service.js";
import TaxRecord from "../../../models/tax/taxRecords/taxRecord.Model.js";
import { TaxResultDTO } from "../../../dtos/taxResult.dto.js";

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculatePayePitAuth(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		const result = calculatePayePit(input);

		const record = await TaxRecord.create({
			userId: req.user._id,
			taxType: "PAYE/PIT",
			taxableIncome: result.taxableIncome,
			annualTax: result.annualTax,
			monthlyTax: result.monthlyTax,
			effectiveTaxRate: result.effectiveTaxRate,
			inputSnapshot: input,
			notes,
		});

		const dto = new TaxResultDTO(result, {
			decimals: 0,
			taxType: "PAYE/PIT",
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

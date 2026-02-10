// src/controllers/tax/cit/cit.public.controller.js
// =========================

import { calculateCitTax } from "../../../services/tax/cit.service.js";
import { AppError } from "../../../errors/AppError.js";
import { CitResultDTO } from "../../../dtos/tax/citResult.dto.js";

// ===================== PUBLIC: CALCULATE ONLY =====================
export async function calculateCitPublic(req, res, next) {
	try {
		const {
			taxableProfit,
			accountingProfit = 0,
			annualTurnover,
			fixedAssets = 0,
			isMultinational = false,
		} = req.body;

		if (taxableProfit == null && accountingProfit == null) {
			throw new AppError(
				"Either taxableProfit or accountingProfit is required",
				400,
			);
		}

		const result = calculateCitTax({
			taxableProfit,
			accountingProfit,
			annualTurnover,
			fixedAssets,
			isMultinational,
		});

		const dto = new CitResultDTO({
			...result,
			decimals: 0,
			taxType: "CIT",
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

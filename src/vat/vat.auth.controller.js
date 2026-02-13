// ================================
// src/vat/vat.auth.controller.js
// ================================

// ================================
import { calculateVat } from "../vat/vat.service.js";
import { VATResultDTO } from "./vatResult.dto.js";
import VATRecord from "./vatRecord.Model.js";
import History from "../history/history.model.js";
// ================================

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculateVatAuth(req, res, next) {
	try {
		const { notes, ...input } = req.body;

		// ===================== CALCULATION =====================
		const result = calculateVat(input);

		// ===================== SAVE RECORD =====================
		const record = await VATRecord.create({
			userId: req.user._id,
			transactionAmount: input.transactionAmount,
			calculationType: input.calculationType,
			transactionType: input.transactionType,
			vatAmount: result.vatAmount,
			totalAmount: result.totalAmount,
			rate: result.vatRate,
			invoiceNumber: input.invoiceNumber || null,
			customer: input.customer || null,
			inputSnapshot: input,
			outputSnapshot: result,
		});

		// ===================== DTO =====================
		const dto = new VATResultDTO(result);

		// ===================== HISTORY =====================
		await History.create({
			userId: req.user._id,
			type: "VAT",
			input,
			result,
			recordId: record._id,
		});

		return res.status(201).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

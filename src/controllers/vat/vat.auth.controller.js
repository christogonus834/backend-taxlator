// src/controllers/vat/vat.auth.controller.js

// ============================
import { calculateVat } from "../../services/vat/vat.service.js";
import VATRecord from "../../models/vat/vatRecords/vatRecord.Model.js";
import History from "../../models/history.model.js";
import { VATResultDTO } from "../../dtos/vat/vatResult.dto.js";

// ===================== PRIVATE: CALCULATE + SAVE =====================
export async function calculateVatAuth(req, res, next) {
	try {
		const result = calculateVat(req.body);

		const record = await VATRecord.create({
			userId: req.user._id,
			transactionAmount: req.body.transactionAmount,
			calculationType: req.body.calculationType,
			transactionType: req.body.transactionType,
			vatAmount: result.vatAmount,
			totalAmount: result.totalAmount,
			rate: result.vatRate,
			invoiceNumber: req.body.invoiceNumber || null,
			customer: req.body.customer || null,
			inputSnapshot: req.body,
		});

		await History.create({
			userId: req.user._id,
			type: "VAT",
			input: req.body,
			result,
		});

		const dto = new VATResultDTO({
			...result,
			customer: req.body.customer,
			invoiceNumber: req.body.invoiceNumber,
		});

		return res.status(201).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

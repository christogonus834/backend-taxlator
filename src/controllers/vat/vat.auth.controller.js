export async function calculateVatAuth(req, res, next) {
	try {
		// ---------- calculation ----------
		const { notes, ...input } = req.body;


		// ---------- save VAT record ----------
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
			inputSnapshot: req.body, // snapshot of what was sent
			outputSnapshot: result, // optional: can be included if you want to save service output
		});

		// ---------- history log ----------
		await History.create({
			userId: req.user._id,
			type: "VAT",
			input: req.body,
			result, // optional snapshot
		});

		// ---------- DTO transformation ----------
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

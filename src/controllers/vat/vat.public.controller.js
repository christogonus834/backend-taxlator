export async function calculateVatPublic(req, res, next) {
	try {
		const result = calculateVat(req.body);

		const dto = new VATResultDTO({
			...result,
			customer: req.body.customer,
			invoiceNumber: req.body.invoiceNumber,
		});

		return res.status(200).json({
			success: true,
			data: dto,
		});
	} catch (error) {
		next(error);
	}
}

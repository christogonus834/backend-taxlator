// =========================
// src/utils/history/buildPdf.js
// =========================

// ========================= HISTORY PDF BUILDER =========================
export const buildHistoryPdf = (doc, items) => {
	doc.fontSize(20).text("Taxlator Report", { align: "center" });
	doc.moveDown();

	items.forEach((item) => {
		doc.rect(40, doc.y, 520, 90).stroke();
		doc.moveDown(0.5);

		doc.fontSize(12).text(`Tax Type: ${item.type}`);
		doc.text(`Date: ${new Date(item.createdAt).toDateString()}`);

		if (item.type === "VAT") {
			doc.text(`Transaction: ${item.input.transactionType}`);
			doc.text(`Amount: ₦${item.input.transactionAmount}`);
			doc.text(`VAT: ₦${item.result.summary?.vatAmount}`);
			doc.text(`Total: ₦${item.result.summary?.totalAmount}`);
		}

		if (item.type === "PAYE") {
			doc.text(`Income: ₦${item.input.annualIncome}`);
			doc.text(`Tax Due: ₦${item.result.summary?.annualTax}`);
		}

		if (item.type === "CIT") {
			doc.text(`Profit: ₦${item.input.taxableProfit}`);
			doc.text(`CIT Payable: ₦${item.result.summary?.finalTax}`);
		}

		doc.moveDown();
	});
};

// =============================
// src/models/vat/vatRecords/vatRecord.Model.js
// =============================

// =========================
import mongoose from "mongoose";

// ========================= VAT RECORD SCHEMA =========================
const VATRecordSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		taxType: { type: String, default: "VAT" },

		// Original request snapshot
		inputSnapshot: { type: Object, required: true },

		// Calculated results
		transactionAmount: { type: Number, required: true, min: 0 },
		vatAmount: { type: Number, min: 0 },
		totalAmount: { type: Number, min: 0 },
		rate: { type: Number, default: 0.075, min: 0, max: 1 },

		// Optional metadata
		invoiceNumber: { type: String },
		customer: { type: String },

		// VAT type fields
		calculationType: { type: String, enum: ["add", "remove"], required: true },
		transactionType: {
			type: String,
			enum: [
				"Domestic sale/Purchase",
				"Digital Services",
				"Export/International",
				"Exempt",
			],
			required: true,
		},
	},
	{ timestamps: true },
);

// =============================
const VATRecord = mongoose.model("VATRecord", VATRecordSchema);
// =============================

export default VATRecord;

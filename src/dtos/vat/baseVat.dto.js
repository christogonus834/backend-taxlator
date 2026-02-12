// src/dtos/vat/baseVat.dto.js

// ========================= BASE VAT DATA TRANSFER OBJECT (DTO) =========================
export class BaseVATDTO {
	constructor(options = {}) {
		this.taxType = options.taxType ?? "VAT";
		this.country = options.country ?? "NG";

		// ========================== Default decimals for formatting =========================
		this.decimals = options.decimals ?? 2;
		this.rateDecimals = options.rateDecimals ?? 2;
	}

	// ========================== Helper method for consistent number formatting =========================
	formatNumber(num, decimals = this.decimals) {
		return num.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals,
		});
	}
}

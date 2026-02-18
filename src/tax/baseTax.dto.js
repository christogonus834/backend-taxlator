// ============================
// src/dtos/tax/baseTax.dto.js
// ============================

// ========================= BASE TAX DATA TRANSFER OBJECT (DTO) =========================
export class BaseTaxDTO {
	constructor(options = {}) {
		this.taxType = options.taxType ?? "TAX";
		this.country = options.country ?? "NG";

		// ========================== Default decimals for formatting =========================
		this.decimals = options.decimals ?? 0;
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

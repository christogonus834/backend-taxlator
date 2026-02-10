// src/dtos/tax/baseTax.dto.js

// ========================= BASE TAX DATA TRANSFER OBJECT (DTO) =========================
export class BaseTaxDTO {
	constructor(options = {}) {
		this.taxType = options.taxType;
		this.country = options.country ?? "NG";
	}

	// ============== FORMAT NUMBER UTILITY ==============
	formatNumber(num, decimals = 0) {
		return num.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals,
		});
	}
}

// ============================
// src/dtos/tax/baseTax.dto.js
// ============================

// ========================= BASE TAX DATA TRANSFER OBJECT (DTO) =========================
export class BaseTaxDTO {
	constructor(options = {}) {
		this.taxType = options.taxType ?? "TAX";
		this.country = options.country ?? "NG";

		// ================= INTERNAL FORMATTING CONFIG =================
		// Make these NON-ENUMERABLE so they never leak into JSON / DB
		Object.defineProperty(this, "decimals", {
			value: options.decimals ?? 0,
			writable: true,
			enumerable: false,
		});

		Object.defineProperty(this, "rateDecimals", {
			value: options.rateDecimals ?? 2,
			writable: true,
			enumerable: false,
		});

		Object.defineProperty(this, "progressive", {
			value: rawProgressiveData,
			writable: true,
			enumerable: false, 
		});
	}

	// ================= NUMBER FORMATTER =================
	formatNumber(num, decimals = this.decimals) {
		return num.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals,
		});
	}

	// ================= PUBLIC SERIALIZER =================
	toPublic() {
		const clean = {};

		for (const [key, value] of Object.entries(this)) {
			if (key.startsWith("_")) continue;

			clean[key] = this.#deepClean(value);
		}

		return clean;
	}

	// ================= AUTO-USED BY JSON.stringify =================
	toJSON() {
		return this.toPublic();
	}

	// ================= DEEP CLEAN HELPER =================
	#deepClean(obj) {
		if (Array.isArray(obj)) {
			return obj.map((v) => this.#deepClean(v));
		}

		if (obj && typeof obj === "object") {
			const cleaned = {};
			for (const [k, v] of Object.entries(obj)) {
				if (k.startsWith("_")) continue;
				cleaned[k] = this.#deepClean(v);
			}
			return cleaned;
		}

		return obj;
	}
}

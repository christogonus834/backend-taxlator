// ==============================
// src/tax/taxModelFactory.js
// =========================

// Factory function to get the appropriate tax model based on tax type.
// =========================
import { PayePit, Freelancer, Cit } from "./taxModel.index.js";
// ==============================

// ==============================
export function getTaxModelByType(taxType) {
	switch (taxType) {
		case "PAYE/PIT":
			return PayePit;
		case "FREELANCER":
			return Freelancer;
		case "CIT":
			return Cit;
		default:
			throw new Error("Invalid tax type");
	}
}

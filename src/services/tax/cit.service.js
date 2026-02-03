// src/services/tax/cit.service.js
// =========================

import Cit from "../../models/tax/calculator/cit.model.js";

export function calculateCitTax(input) {
	return Cit.calculate(input);
}

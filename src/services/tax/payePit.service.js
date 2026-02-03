// src/services/tax/payePit.service.js
// =========================

import PayePit from "../../models/tax/calculator/payePit.model.js";

// ===================== PAYE/PIT SERVICE =====================

export function calculatePayePit(input) {
	return PayePit.calculate(input);
}

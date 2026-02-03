// src/services/tax/freelancer.service.js
// =========================

import Freelancer from "../../models/calculator/freelancer.model.js";

export function calculateFreelancerTax(input) {
	return Freelancer.calculate(input);
}

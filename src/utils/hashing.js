// ===========================
// src/utils/hashing.js
// ===========================

// =========================
import { hash, compare } from "bcryptjs";

// ===================== HASHING UTILITIES =====================
export const doHash = async (value, saltValue) => {
	const result = await hash(value, saltValue);
	return result;
};

export const doHashValidation = async (value, hashedValue) => {
	const result = await compare(value, hashedValue);
	return result;
};

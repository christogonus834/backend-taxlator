// src/utils/user/hashing.js

// =========================
import { hash, compare } from "bcryptjs";

// ===================== HASHING UTILITIES =====================
export const doHash = async (value, saltValue) => {
	const result = hash(value, saltValue);
	return result;
};

export const doHashValidation = (value, hashedValue) => {
	const result = compare(value, hashedValue);
	return result;
};

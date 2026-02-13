// ===========================
// src/utils/paths.js
// =========================

// ===========================
import path from "path";
import { fileURLToPath } from "url";

// ========================= PATH UTILS =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================= ROOT DIRECTORY =========================
export const ROOT_DIR = path.resolve(__dirname, "../../");

export { __dirname, __filename };

// ===============================
// src/shared/router/index.js
// ===============================

// ========================
import authRouter from "./auth.routes.js";
import taxRouter from "../../tax/tax.routes.js";
import vatRouter from "../../vat/vat.routes.js";

// ======================== ALL ROUTE BARREL EXPORT TAX/VAT ========================
export { authRouter, taxRouter, vatRouter };

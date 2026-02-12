// src/router/index.js

// ========================
import authRouter from "../router/user/auth.routes.js";
import taxRouter from "../router/tax/tax.routes.js";
import vatRouter from "../router/vat/vat.routes.js";

// ======================== ALL ROUTE BARREL EXPORT TAX/VAT ========================
export { authRouter, taxRouter, vatRouter };

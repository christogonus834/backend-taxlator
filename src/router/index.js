// src/router/index.js

// ========================
import authRoutes from "../router/user/auth.routes.js";
import historyRoutes from "../router/history.routes.js";
import taxRoutes from "../router/tax/tax.routes.js";
import vatRoutes from "../router/vat/vat.routes.js";

// ======================== ALL ROUTE BARREL EXPORT TAX/VAT ========================
export { authRoutes, historyRoutes, taxRoutes, vatRoutes };

// ===============================
// src/shared/router/api.routes.js
// ========================

import express from "express";
import { authRouter, taxRouter, vatRouter, historyRouter } from "./index.js";

// ======================== API ROUTER ========================
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/history", historyRouter);
apiRouter.use("/tax", taxRouter);
apiRouter.use("/vat", vatRouter);
// ===============================

export default apiRouter;

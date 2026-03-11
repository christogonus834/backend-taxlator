// ===============================
// src/shared/router/api.routes.js
// Description: This file defines the main API router for the application. It imports various sub-routers for different functionalities such as authentication, tax calculations, VAT calculations, user history, and user profiles. Each sub-router is mounted on a specific path, allowing for organized and modular routing within the application.
// Wagon, let's keep building this awesome app!  bro
// ========================
import express from "express";
import { authRouter, taxRouter, vatRouter, historyRouter } from "./index.js";
import profileRouter from "../../user/profile.routes.js";

// ======================== API ROUTER ========================
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/history", historyRouter);
apiRouter.use("/tax", taxRouter);
apiRouter.use("/vat", vatRouter);
apiRouter.use("/profile", profileRouter);
// ===============================
export default apiRouter;
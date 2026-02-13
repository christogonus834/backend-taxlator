// ==============================
// src/tax/tax.routes.js
// ==============================

// ========================
import express from "express";
import payePitRouter from "./payePit/payePit.routes.js";
import freelancerRouter from "./freelancer/freelancer.routes.js";
import citRouter from "./cit/cit.routes.js";
// ==============================

// ==============================
const taxRouter = express.Router();
// ==============================

// ======================== TAX ROUTES ========================
taxRouter.use("/payePit", payePitRouter);
taxRouter.use("/freelancer", freelancerRouter);
taxRouter.use("/cit", citRouter);
// ==============================

export default taxRouter;

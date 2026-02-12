// src/router/tax/tax.routes.js

// ========================
import express from "express";
import {
	payePitRouter,
	freelancerRouter,
	citRouter,
} from "../../router/tax/index.js";

const taxRouter = express.Router();

// ======================== TAX ROUTES ========================
taxRouter.use("/payePit", payePitRouter);
taxRouter.use("/freelancer", freelancerRouter);
taxRouter.use("/cit", citRouter);

export default taxRouter;

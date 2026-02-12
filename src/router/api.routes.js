// src/router/api.routes.js
// ========================
import express from "express";
import {
	authRouter,
	taxRouter,
	vatRouter,
} from "../router/index.js";

// ======================== API ROUTER ========================
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tax", taxRouter);
apiRouter.use("/vat", vatRouter);

export default apiRouter;

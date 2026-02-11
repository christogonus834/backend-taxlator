// src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import errorMiddleware from "./middlewares/error/error.middleware.js";
import router from "./router/api.routes.js";
import { ROOT_DIR } from "./utils/other/paths.js";

const app = express();

// ======================= CORS CONFIG =======================
const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:8000",
	"https://taxlator-gov.netlify.app",
	process.env.CLIENT_URL,
].filter(Boolean);

// Global CORS middleware
app.use(
	cors({
		origin(origin, callback) {
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) return callback(null, true);
			console.warn("❌ Blocked CORS origin:", origin);
			return callback(null, false);
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// ================= SECURITY =================
app.use(helmet());

// ================= MIDDLEWARES =================
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ================= DOCS =================
app.use("/docs", express.static(path.join(ROOT_DIR, "public/docs")));

// ================= API ROUTES =================
app.use("/api", router);

// ================= HEALTH CHECK =================
app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

// ================= OAUTH CALLBACK =================
app.get("/oauth2callback", (req, res) => {
	const { code, error } = req.query;

	if (error) return res.status(400).send(`OAuth error: ${error}`);
	if (!code) return res.status(400).send("Missing ?code= in callback URL.");

	return res.status(200).send("Authorization received.");
});

// ================= ROOT =================
app.get("/", (_req, res) => {
	res.send("✅ Taxlator API running");
});

// ================= ERROR HANDLING =================
app.use(errorMiddleware);

export default app;

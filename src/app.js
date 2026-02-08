// src/app.js
// ========================

// ================= MAIN APP SETUP ==================
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import errorMiddleware from "./middlewares/error/error.middleware.js";
import router from "./router/api.routes.js";
import { ROOT_DIR } from "./utils/other/paths.js";

const app = express();

// ======================= CORS CONFIGURATION =======================
const isProd = process.env.NODE_ENV === "production";

// Local dev origins
const localOrigins = ["http://localhost:5173", "http://localhost:8000"];

// Frontend origin(s)
const prodOrigins = [
	"https://taxlator-gov.netlify.app",
	process.env.CLIENT_URL,
].filter(Boolean);

const allowedOrigins = [...localOrigins, ...prodOrigins];

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests like Postman (no origin)
			if (!origin) return callback(null, true);

			if (allowedOrigins.includes(origin)) return callback(null, true);

			console.warn(`Blocked CORS request from origin: ${origin}`);
			return callback(new Error(`CORS blocked for origin: ${origin}`));
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// ================= MIDDLEWARES =================
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ================= DOCS =================
app.use("/docs", express.static(path.join(ROOT_DIR, "public/docs")));

// ================= API ROUTES =================
app.use("/api", router);

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

// ================= OAUTH CALLBACK =================
app.get("/oauth2callback", (req, res) => {
	const { code, error } = req.query;

	if (error) return res.status(400).send(`OAuth error: ${error}`);
	if (!code) return res.status(400).send("Missing ?code= in callback URL.");

	return res
		.status(200)
		.send(
			"Authorization received. Copy the code from the URL and paste it into your terminal.",
		);
});

// ================= ROOT =================
app.get("/", (req, res) => {
	res.send(
		"✅ Taxlator API running. Routes: /api/auth, /api/history, /api/tax, /api/vat, /health",
	);
});

// ================= ERROR HANDLING =================
app.use(errorMiddleware);

export default app;

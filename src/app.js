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

const localOrigins = ["http://localhost:5173", "http://localhost:8000"];

const prodOrigins = [
	"https://taxlator-gov.netlify.app",
	process.env.CLIENT_URL,
].filter(Boolean);

// ==================== COMBINE ALLOWED ORIGINS ====================
const allowedOrigins = [
	"http://localhost:5173", // local dev
	"https://taxlator-gov.netlify.app", // deployed frontend
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true); // Postman / server-to-server
			if (allowedOrigins.includes(origin)) return callback(null, true);
			console.warn("Blocked CORS origin:", origin);
			return callback(new Error("Not allowed by CORS"));
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

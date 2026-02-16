// ========================
// src/app.js
// ========================

// ========================
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import errorMiddleware from "./shared/middleware/error.middleware.js";
import apiRouter from "./shared/router/api.routes.js";
import { ROOT_DIR } from "./utils/paths.js";
// ========================

const app = express();
// ========================

// ======================= TRUST PROXY =======================
// Required for secure cookies behind Vercel/Render
app.set("trust proxy", 1);

// ======================= CORS CONFIG =======================
const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:8000",
	"https://taxlator-gov.vercel.app", 
];

const corsOptions = {
	origin(origin, callback) {
		if (!origin) return callback(null, true); // allow server-to-server requests
		if (allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// ======================= SECURITY =======================
app.use(
	helmet({
		crossOriginResourcePolicy: { policy: "cross-origin" },
	}),
);

// ======================= MIDDLEWARE =======================
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ======================= DOCS =======================
app.use("/docs", express.static(path.join(ROOT_DIR, "public/docs")));

// ======================= API ROUTES =======================
app.use("/api", apiRouter);

// ======================= HEALTH CHECK =======================
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ======================= ROOT =======================
app.get("/", (_req, res) => res.send("✅ Taxlator API running"));

// ======================= ERROR HANDLING =======================
app.use(errorMiddleware);
// ========================

export default app;

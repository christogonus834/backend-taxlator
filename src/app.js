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
	"https://taxlator-gov.vercel.app",
];

// 🔍 Preflight + request logger (DEBUG SAFE)
app.use((req, _res, next) => {
	if (req.method === "OPTIONS") {
		console.log("🟡 PREFLIGHT:", req.originalUrl);
	}
	console.log("➡️", req.method, req.originalUrl);
	next();
});

app.use(
	cors({
		origin(origin, callback) {
			console.log("🌍 CORS origin:", origin);

			// Allow server-to-server, curl, Postman
			if (!origin) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				console.log("✅ Allowed origin:", origin);
				return callback(null, true);
			}

			console.warn("❌ Blocked by CORS:", origin);

			// ⚠️ IMPORTANT: never throw errors here
			return callback(null, false);
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// ❌ REMOVE wildcard options route (cors() already handles this)
// app.options(/.*/, cors());

// ================= SECURITY =================
// Helmet AFTER CORS (correct order)
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

// ================= ROOT =================
app.get("/", (_req, res) => {
	res.send("✅ Taxlator API running");
});

// ================= ERROR HANDLING =================
app.use(errorMiddleware);

export default app;

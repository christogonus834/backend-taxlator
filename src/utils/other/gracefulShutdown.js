// src/utils/gracefulShutdown.js

// =========================
import mongoose from "mongoose";

// ======================== GRACEFUL SHUTDOWN HANDLER =========================
export const gracefulShutdown = (server) => {
	let shuttingDown = false;

	const shutdown = async (signal) => {
		if (shuttingDown) return;
		shuttingDown = true;

		console.log(`🛑 [${signal}] received. Shutting down gracefully...`);

		try {
			// Stop accepting new HTTP requests
			// =====================
			if (server) {
				await new Promise((resolve, reject) => {
					server.close((err) => {
						if (err) return reject(err);
						console.log("✅ HTTP server closed");
						resolve();
					});
				});
			}

			// Close MongoDB connection
			// =====================
			if (mongoose.connection.readyState === 1) {
				// 1 = connected
				await mongoose.connection.close(false);
				console.log("✅ MongoDB connection closed");
			}

			console.log("✅ Graceful shutdown complete. Exiting.");
			process.exit(0);
		} catch (err) {
			console.error("❌ Error during shutdown:", err);
			process.exit(1);
		}
	};

	// Listen for termination signals
	//======================
	["SIGINT", "SIGTERM", "SIGQUIT"].forEach((sig) => {
		process.on(sig, () => shutdown(sig));
	});

	// Handle unexpected errors
	//======================
	process.on("unhandledRejection", (reason) => {
		console.error("❌ Unhandled Rejection:", reason);
		shutdown("unhandledRejection");
	});

	process.on("uncaughtException", (err) => {
		console.error("❌ Uncaught Exception:", err);
		shutdown("uncaughtException");
	});
};

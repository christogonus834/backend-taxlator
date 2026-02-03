// src/utils/gracefulShutdown.js
// =========================

// This module sets up graceful shutdown handling for the server.
// It listens for termination signals and ensures that the
// server and database connections are closed properly before exiting.
// =========================

import mongoose from "mongoose";
export const setupGracefulShutdown = (server) => {
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

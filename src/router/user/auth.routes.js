// src/routers/auth.routes.js

// =========================
import express from "express";
import AuthController from "../../controllers/auth/index.js";
import { protect } from "../../middlewares/auth/authMiddleware.js";
import { requestLogger } from "../../middlewares/dev/requestLogger.js";

const authRouter = express.Router();

// =========================
// Module-level request logging
// All requests to this router will log with "AUTH" prefix
authRouter.use(requestLogger("AUTH"));

/* ================= PUBLIC ROUTES ================= */

// Signup
authRouter.post("/signup", AuthController.signup);

// Signin
authRouter.post("/signin", AuthController.signin);

// Send verification code
authRouter.post("/send-code", AuthController.sendVerificationCode);

// Verify email
authRouter.post("/verify-email", AuthController.verifyEmail);

// Check email availability
authRouter.get("/check-email", AuthController.checkEmailController);

// Forgot password
authRouter.post("/forgot-password", AuthController.forgotPassword);

// Reset password
authRouter.post("/reset-password", AuthController.resetPassword);

/* ================= PROTECTED ROUTES ================= */

// Get current user
authRouter.get("/me", protect, AuthController.me);

// Change password
authRouter.post("/change-password", protect, AuthController.changePassword);

// Signout
authRouter.post("/signout", protect, AuthController.signout);

export default authRouter;

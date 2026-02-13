// ==============================
// src/shared/router/auth.routes.js
// ==============================

// =========================
import express from "express";
import AuthController from "../../auth/index.js";
import { protect } from "../../auth/authMiddleware.js";
import { requestLogger } from "../middleware/dev/requestLogger.js";
// ==============================

// ==============================
const authRouter = express.Router();
// ==============================

// =========================
// Module-level request logging
authRouter.use(requestLogger("AUTH"));
// ==============================

// ==============================
// Log the keys of AuthController to verify correct import
console.log("Router sees AuthController:", Object.keys(AuthController));
// ==============================

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
// ==============================

export default authRouter;

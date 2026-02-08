// src/routers/auth.routes.js

// ===============================

import express from "express";
import AuthController from "../../controllers/auth/index.js";
import { protect } from "../../middlewares/auth/authMiddleware.js";

const router = express.Router();

/* ================= AUTH ROUTES ================= */

// Signup
router.post("/signup", AuthController.signup);

// Send verification code
router.post("/send-code", AuthController.sendVerificationCode);

// Verify email
router.post("/verify-email", AuthController.verifyEmail);

// Signin
router.post("/signin", AuthController.signin);

// Me (protected)
router.get("/me", protect, AuthController.me);

// Change password (protected)
router.post("/change-password", protect, AuthController.changePassword);

// Forgot password
router.post("/forgot-password", AuthController.forgotPassword);

// Reset password
router.post("/reset-password", AuthController.resetPassword);

// Signout
router.post("/signout", AuthController.signout);

export default router;

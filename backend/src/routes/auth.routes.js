const express = require("express");
const { z } = require("zod");
const { validate } = require("../middlewares/validate.middleware.js");
const { authMiddleware } = require("../middlewares/auth.middleware.js");
const authController = require("../controllers/auth.controller.js");

const router = express.Router();

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

const loginSchema = z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
});

const refreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh", validate(refreshSchema), authController.refresh);

router.get("/me", authMiddleware, authController.me);

module.exports = router;
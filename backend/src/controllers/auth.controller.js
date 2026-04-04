const { successResponse } = require("../utils/apiResponse.js");
const { registerUser, loginUser, refreshToken, getCurrentUser } = require("../services/auth.service.js");

async function register(req, res, next) {
    try {
        const user = await registerUser(req.body);
        return successResponse(res, "User registered", { user }, 201);
    } catch (error) {
        return next(error);
    }
}

async function login(req, res, next) {
    try {
        const result = await loginUser(req.body);
        return successResponse(res, "Login successful", result);
    } catch (error) {
        return next(error);
    }
}

async function me(req, res, next) {
    try {
        const user = await getCurrentUser(req.user.id);
        return successResponse(res, "Current user", { user });
    } catch (error) {
        return next(error);
    }
}

async function refresh(req, res, next) {
    try {
        const result = await refreshToken(req.body.refreshToken);
        return successResponse(res, "Token refreshed", result);
    } catch (error) {
        return next(error);
    }
}

module.exports = { register, login, refresh, me };
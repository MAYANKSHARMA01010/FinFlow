const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/apiError.js");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SESSION_SECRET);
        return next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized");
    }
}

module.exports = { authMiddleware };
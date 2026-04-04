const jwt = require("jsonwebtoken");

function generateSessionToken(payload) {
    return jwt.sign(payload, process.env.JWT_SESSION_SECRET, {
        expiresIn: process.env.JWT_SESSION_EXPIRES_IN,
    });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
}

module.exports = { generateSessionToken, generateRefreshToken };
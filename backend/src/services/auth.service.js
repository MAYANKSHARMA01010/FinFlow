const { prisma } = require("../config/prisma.js");
const { ApiError } = require("../utils/apiError.js");
const { hashPassword, comparePassword } = require("../utils/hashPassword.js");
const jwt = require("jsonwebtoken");

async function registerUser(data) {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new ApiError(400, "Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || "VIEWER",
            status: data.status || "ACTIVE",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

async function loginUser(data) {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (user.status === "INACTIVE") {
        throw new ApiError(403, "User is inactive");
    }

    const passwordMatch = await comparePassword(data.password, user.password);

    if (!passwordMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
    };

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        accessToken: jwt.sign(tokenPayload, process.env.JWT_SESSION_SECRET, {
            expiresIn: "7d",
        }),
        refreshToken: jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        }),
    };
}

async function refreshToken(token) {
    let payload;

    try {
        payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
    });

    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (user.status === "INACTIVE") {
        throw new ApiError(403, "User is inactive");
    }

    const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
    };

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        accessToken: jwt.sign(tokenPayload, process.env.JWT_SESSION_SECRET, {
            expiresIn: "7d",
        }),
        refreshToken: jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        }),
    };
}

async function getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
}

module.exports = { registerUser, loginUser, refreshToken, getCurrentUser };
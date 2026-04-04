const { prisma } = require("../config/prisma.js");
const { ApiError } = require("../utils/apiError.js");

const ALLOWED_ROLES = ["ADMIN", "ANALYST", "VIEWER"];

function ensureUserFound(user) {
    if (!user) {
        throw new ApiError(404, "User not found");
    }
}

async function getAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
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

    ensureUserFound(user);
    return user;
}

async function updateUserRole(id, role) {
    if (!ALLOWED_ROLES.includes(role)) {
        throw new ApiError(400, "Invalid role value");
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    ensureUserFound(existingUser);

    return prisma.user.update({
        where: { id },
        data: { role },
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

async function updateUserStatus(id) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    ensureUserFound(existingUser);

    const nextStatus = existingUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    return prisma.user.update({
        where: { id },
        data: { status: nextStatus },
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

async function deleteUser(id) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    ensureUserFound(existingUser);

    await prisma.user.delete({ where: { id } });
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    updateUserStatus,
    deleteUser,
};
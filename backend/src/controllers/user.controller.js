const { ApiError } = require("../utils/apiError.js");
const { successResponse } = require("../utils/apiResponse.js");
const {
    getAllUsers,
    getUserById,
    updateUserRole,
    updateUserStatus,
    deleteUser,
} = require("../services/user.service.js");

function parseUserId(idParam) {
    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
        throw new ApiError(400, "Invalid user id");
    }

    return id;
}

async function getUsers(req, res, next) {
    try {
        const users = await getAllUsers();
        return successResponse(res, "Users fetched", { users });
    } catch (error) {
        return next(error);
    }
}

async function getUser(req, res, next) {
    try {
        const id = parseUserId(req.params.id);
        const user = await getUserById(id);
        return successResponse(res, "User fetched", { user });
    } catch (error) {
        return next(error);
    }
}

async function patchUserRole(req, res, next) {
    try {
        const id = parseUserId(req.params.id);
        const user = await updateUserRole(id, req.body.role);
        return successResponse(res, "User role updated", { user });
    } catch (error) {
        return next(error);
    }
}

async function patchUserStatus(req, res, next) {
    try {
        const id = parseUserId(req.params.id);
        const user = await updateUserStatus(id);
        return successResponse(res, "User status updated", { user });
    } catch (error) {
        return next(error);
    }
}

async function removeUser(req, res, next) {
    try {
        const id = parseUserId(req.params.id);
        await deleteUser(id);
        return successResponse(res, "User deleted", {});
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getUsers,
    getUser,
    patchUserRole,
    patchUserStatus,
    removeUser,
};
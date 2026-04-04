const { successResponse } = require("../utils/apiResponse.js");
const {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    softDeleteRecord,
} = require("../services/record.service.js");

async function create(req, res, next) {
    try {
        const record = await createRecord(req.body, req.user.id);
        return successResponse(res, "Record created", { record }, 201);
    } catch (error) {
        return next(error);
    }
}

async function getAll(req, res, next) {
    try {
        const { type, category, startDate, endDate } = req.query;
        const records = await getAllRecords({ type, category, startDate, endDate });
        return successResponse(res, "Records fetched", { records });
    } catch (error) {
        return next(error);
    }
}

async function getOne(req, res, next) {
    try {
        const record = await getRecordById(req.params.id);
        return successResponse(res, "Record fetched", { record });
    } catch (error) {
        return next(error);
    }
}

async function update(req, res, next) {
    try {
        const record = await updateRecord(req.params.id, req.body, req.user.id);
        return successResponse(res, "Record updated", { record });
    } catch (error) {
        return next(error);
    }
}

async function remove(req, res, next) {
    try {
        await softDeleteRecord(req.params.id);
        return successResponse(res, "Record deleted", {});
    } catch (error) {
        return next(error);
    }
}

module.exports = { create, getAll, getOne, update, remove };
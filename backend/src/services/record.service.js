const { prisma } = require("../config/prisma.js");
const { ApiError } = require("../utils/apiError.js");
const ALLOWED_TYPES = ["INCOME", "EXPENSE"];

function parseRecordId(idParam) {
    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
        throw new ApiError(400, "Invalid record id");
    }

    return id;
}

function ensureRecordFound(record) {
    if (!record || record.isDeleted) {
        throw new ApiError(404, "Record not found");
    }
}

async function createRecord(data, createdBy) {
    if (typeof data.amount !== "number" || Number.isNaN(data.amount) || data.amount <= 0) {
        throw new ApiError(400, "Amount must be a positive number");
    }

    if (!ALLOWED_TYPES.includes(data.type)) {
        throw new ApiError(400, "Invalid record type");
    }

    if (!createdBy) {
        throw new ApiError(401, "Unauthorized");
    }

    return prisma.financialRecord.create({
        data: {
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: new Date(data.date),
            notes: data.notes,
            createdBy,
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
    });
}

async function getAllRecords(filters = {}) {
    const where = { isDeleted: false };

    if (filters.type) {
        if (!ALLOWED_TYPES.includes(filters.type)) {
            throw new ApiError(400, "Invalid type filter");
        }

        where.type = filters.type;
    }

    if (filters.category) {
        where.category = filters.category;
    }

    if (filters.createdBy) {
        where.createdBy = Number(filters.createdBy);
    }

    if (filters.startDate || filters.endDate) {
        where.date = {};

        if (filters.startDate) {
            where.date.gte = new Date(filters.startDate);
        }

        if (filters.endDate) {
            where.date.lte = new Date(filters.endDate);
        }
    }

    return prisma.financialRecord.findMany({
        where,
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { date: "desc" },
    });
}

async function getRecordById(idParam) {
    const id = parseRecordId(idParam);

    const record = await prisma.financialRecord.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
    });

    ensureRecordFound(record);
    return record;
}

async function updateRecord(idParam, data, updatedBy) {
    const id = parseRecordId(idParam);

    const existingRecord = await prisma.financialRecord.findUnique({ where: { id } });
    ensureRecordFound(existingRecord);

    if (!updatedBy) {
        throw new ApiError(401, "Unauthorized");
    }

    if (data.amount !== undefined) {
        if (typeof data.amount !== "number" || Number.isNaN(data.amount) || data.amount <= 0) {
            throw new ApiError(400, "Amount must be a positive number");
        }
    }

    if (data.type !== undefined) {
        if (!ALLOWED_TYPES.includes(data.type)) {
            throw new ApiError(400, "Invalid record type");
        }
    }

    const updateData = {};

    if (data.amount !== undefined) {
        updateData.amount = data.amount;
    }

    if (data.type !== undefined) {
        updateData.type = data.type;
    }

    if (data.category !== undefined) {
        updateData.category = data.category;
    }

    if (data.date !== undefined) {
        updateData.date = new Date(data.date);
    }

    if (data.notes !== undefined) {
        updateData.notes = data.notes;
    }

    return prisma.financialRecord.update({
        where: { id },
        data: updateData,
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
    });
}

async function deleteRecord(idParam) {
    const id = parseRecordId(idParam);

    const existingRecord = await prisma.financialRecord.findUnique({ where: { id } });
    ensureRecordFound(existingRecord);

    return prisma.financialRecord.update({
        where: { id },
        data: { isDeleted: true },
    });
}

module.exports = {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
    softDeleteRecord: deleteRecord,
};
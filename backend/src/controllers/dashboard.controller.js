const { successResponse } = require("../utils/apiResponse.js");
const {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getRecentActivity,
} = require("../services/dashboard.service.js");

async function summary(req, res, next) {
    try {
        const data = await getSummary();
        return successResponse(res, "Dashboard summary", data);
    } catch (error) {
        return next(error);
    }
}

async function categoryBreakdown(req, res, next) {
    try {
        const data = await getCategoryBreakdown();
        return successResponse(res, "Category breakdown", { categories: data });
    } catch (error) {
        return next(error);
    }
}

async function monthlyTrends(req, res, next) {
    try {
        const data = await getMonthlyTrends();
        return successResponse(res, "Monthly trends", { trends: data });
    } catch (error) {
        return next(error);
    }
}

async function recentActivity(req, res, next) {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await getRecentActivity(limit);
        return successResponse(res, "Recent activity", { activities: data });
    } catch (error) {
        return next(error);
    }
}

module.exports = { summary, categoryBreakdown, monthlyTrends, recentActivity };

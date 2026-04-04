const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware.js");
const { authorize } = require("../middlewares/role.middleware.js");
const dashboardController = require("../controllers/dashboard.controller.js");

const router = express.Router();

router.get(
    "/summary",
    authMiddleware,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    dashboardController.summary
);

router.get(
    "/category-breakdown",
    authMiddleware,
    authorize("ADMIN", "ANALYST"),
    dashboardController.categoryBreakdown
);

router.get(
    "/monthly-trends",
    authMiddleware,
    authorize("ADMIN", "ANALYST"),
    dashboardController.monthlyTrends
);

router.get(
    "/recent-activity",
    authMiddleware,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    dashboardController.recentActivity
);

module.exports = router;

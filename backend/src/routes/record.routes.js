const express = require("express");
const { z } = require("zod");
const { authMiddleware } = require("../middlewares/auth.middleware.js");
const { authorize } = require("../middlewares/role.middleware.js");
const { validate } = require("../middlewares/validate.middleware.js");
const recordController = require("../controllers/record.controller.js");

const router = express.Router();

const createRecordSchema = z.object({
    amount: z.coerce.number(),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1, "Category is required"),
    date: z.string().datetime(),
    notes: z.string().optional(),
});

const updateRecordSchema = z.object({
    amount: z.coerce.number().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1, "Category is required").optional(),
    date: z.string().datetime().optional(),
    notes: z.string().optional(),
});

router.post(
    "/",
    authMiddleware,
    authorize("ADMIN"),
    validate(createRecordSchema),
    recordController.create
);

router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    recordController.getAll
);

router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    recordController.getOne
);

router.put(
    "/:id",
    authMiddleware,
    authorize("ADMIN"),
    validate(updateRecordSchema),
    recordController.update
);

router.delete("/:id", authMiddleware, authorize("ADMIN"), recordController.remove);

module.exports = router;
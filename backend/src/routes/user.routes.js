const express = require("express");
const { z } = require("zod");
const { authMiddleware } = require("../middlewares/auth.middleware.js");
const { authorize } = require("../middlewares/role.middleware.js");
const { validate } = require("../middlewares/validate.middleware.js");
const userController = require("../controllers/user.controller.js");

const router = express.Router();

const roleSchema = z.object({
    role: z.enum(["ADMIN", "ANALYST", "VIEWER"]),
});

router.get("/", authMiddleware, authorize("ADMIN"), userController.getUsers);
router.get("/:id", authMiddleware, authorize("ADMIN"), userController.getUser);
router.patch(
    "/:id/role",
    authMiddleware,
    authorize("ADMIN"),
    validate(roleSchema),
    userController.patchUserRole
);
router.patch(
    "/:id/status",
    authMiddleware,
    authorize("ADMIN"),
    userController.patchUserStatus
);
router.delete("/:id", authMiddleware, authorize("ADMIN"), userController.removeUser);

module.exports = router;
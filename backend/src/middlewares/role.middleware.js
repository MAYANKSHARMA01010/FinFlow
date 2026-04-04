const { ApiError } = require("../utils/apiError.js");

function authorize(...allowedRoles) {
    return function (req, res, next) {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden");
        }

        return next();
    };
}

module.exports = { authorize };
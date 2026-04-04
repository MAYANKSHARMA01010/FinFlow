const { ApiError } = require("../utils/apiError.js");

function validate(schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => {
                const field = issue.path.length ? issue.path.join(".") : "body";
                return `${field}: ${issue.message}`;
            });

            throw new ApiError(400, "Validation failed", errors);
        }

        req.body = result.data;
        return next();
    };
}

module.exports = { validate };
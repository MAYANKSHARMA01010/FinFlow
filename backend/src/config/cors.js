const cors = require("cors");

const isProd = process.env.NODE_ENV === "production";

const allowedOrigins = isProd
    ? [process.env.FRONTEND_SERVER_URL]
    : [process.env.FRONTEND_LOCAL_URL];

if (!allowedOrigins[0]) {
    throw new Error("CORS origin is not defined");
}

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`❌ Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);

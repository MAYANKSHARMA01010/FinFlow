const cors = require("cors");

const allowedOrigins = [
    process.env.FRONTEND_LOCAL_URL,
    process.env.FRONTEND_SERVER_URL,
].filter(Boolean);

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

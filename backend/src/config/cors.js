const cors = require("cors");

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = isProduction
    ? [
          process.env.FRONTEND_SERVER_URL,
          // Fallback to local if server URL is not configured.
          process.env.FRONTEND_LOCAL_URL,
      ].filter(Boolean)
    : [
          process.env.FRONTEND_LOCAL_URL,
          // Allow server URL in development when testing staging UI.
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

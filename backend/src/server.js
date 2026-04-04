const express = require("express");
const corsMiddleware = require("./config/cors.js");
const { successResponse } = require("./utils/apiResponse.js");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(corsMiddleware);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
    return successResponse(res, "Backend is healthy", {
        service: "FinFlow Backend",
        timestamp: new Date().toISOString(),
    });
});

app.get("/", (req, res) => {
    return successResponse(res, "Backend running successfully", {
        service: "FinFlow Backend",
    });
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        errors: error.errors || [],
    });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`DEBUG: NODE_ENV = ${process.env.NODE_ENV}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`✅ Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});

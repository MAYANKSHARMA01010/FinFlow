const express = require("express");
const corsMiddleware = require("./config/cors.js");
const { successResponse } = require("./utils/apiResponse.js");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(corsMiddleware);
app.use(express.json());

app.get("/health", (req, res) => {
    return successResponse(res, "Backend is healthy", {
        service: "FinFlow Backend",
        timestamp: new Date().toISOString(),
    });
});

// app.get("/health/db", async (req, res) => {
//     try {
//         await executeDbCall("health.db", () => prisma.$queryRaw`SELECT 1`, 3000);
//         return res.status(200).json({
//             ok: true,
//             database: "reachable",
//             timestamp: new Date().toISOString(),
//         });
//     } catch (err) {
//         return res.status(503).json({
//             ok: false,
//             database: "unreachable",
//             reason: err?.message || "Database check failed",
//             timestamp: new Date().toISOString(),
//         });
//     }
// });

app.get("/", (req, res) => {
    return successResponse(res, "Backend running successfully", {
        service: "FinFlow Backend",
    });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`DEBUG: NODE_ENV = ${process.env.NODE_ENV}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`✅ Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import corsMiddleware from "./config/cors.js";

app.use(corsMiddleware);

// =====================================
// Config
// =====================================
import corsOptions from "./config/cors.js";

// =====================================
// Routes
// =====================================
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import userRoutes from "./routes/user.routes.js";
import parcelRoutes from "./routes/parcel.routes.js";

// =====================================
// Middlewares
// =====================================
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

// =====================================
// Utils
// =====================================
import AppError from "./utils/AppError.js";

const app = express();

// =====================================
// Global Middlewares
// =====================================

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// API Routes
// =====================================

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/parcels", parcelRoutes);

// =====================================
// Health Check
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Courier Management API is running.",
  });
});

// =====================================
// 404 Handler
// =====================================

app.all("/{*splat}", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server.`,
      404
    )
  );
});

// =====================================
// Global Error Handler
// =====================================

app.use(globalErrorHandler);

export default app;
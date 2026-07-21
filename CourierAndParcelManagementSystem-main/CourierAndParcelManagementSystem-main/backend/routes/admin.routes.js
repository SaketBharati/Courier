import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import * as adminController from "../controllers/admin.controller.js";

const router = express.Router();

// Apply middleware to all admin routes
router.use(verifyToken, verifyAdmin);

// =====================================
// Admin Routes
// =====================================

// Get all users
router.get(
  "/users",
  adminController.getAllUsers
);

// Get all parcels
router.get(
  "/parcels",
  adminController.getAllParcels
);

// Dashboard analytics
router.get(
  "/dashboard-metrics",
  adminController.getDashboardMetrics
);

// Update user
router.patch(
  "/users/:id",
  adminController.updateUserByAdmin
);

// Assign delivery agent to parcel
router.put(
  "/parcels/:id/assign",
  adminController.assignAgentToParcel
);

export default router;
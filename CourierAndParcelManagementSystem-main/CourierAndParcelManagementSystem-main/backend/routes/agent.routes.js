import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {verifyAgent} from "../middlewares/verifyRole.js";
import * as agentController from "../controllers/agent.controller.js";

const router = express.Router();

// =====================================
// Delivery Agent Routes
// =====================================

// Get all parcels assigned to the logged-in agent
router.get(
  "/parcels",
  verifyToken,
  verifyAgent,
  agentController.getAssignedParcels
);

// Update parcel status
router.put(
  "/parcels/:id/status",
  verifyToken,
  verifyAgent,
  agentController.updateParcelStatus
);

// Update parcel location
router.put(
  "/parcels/:id/location",
  verifyToken,
  verifyAgent,
  agentController.updateParcelLocation
);

// Export assigned parcels as CSV
router.get(
  "/export-csv",
  verifyToken,
  verifyAgent,
  agentController.exportParcelsCSV
);

// Export assigned parcels as PDF
router.get(
  "/export-pdf",
  verifyToken,
  verifyAgent,
  agentController.exportParcelsPDF
);

export default router;
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {verifyCustomer} from "../middlewares/verifyRole.js";
import * as parcelController from "../controllers/parcel.controller.js";

const router = express.Router();

// =====================================
// Customer Parcel Routes
// =====================================

// Create a new parcel
router.post(
  "/",
  verifyToken,
  verifyCustomer,
  parcelController.createParcel
);

// Get all bookings of the logged-in customer
router.get(
  "/myBooking",
  verifyToken,
  verifyCustomer,
  parcelController.getMyBookings
);

// Get parcel details by ID
router.get(
  "/:id",
  verifyToken,
  parcelController.getParcelById
);

export default router;
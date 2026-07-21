import * as parcelService from "../services/parcel.service.js";

// =====================================
// Create Parcel
// =====================================
export const createParcel = async (req, res) => {
  try {
    const result = await parcelService.createParcel(
      req.body,
      req.decoded.email
    );

    res.status(201).json({
      success: true,
      message: "Parcel created successfully.",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Create Parcel Error:", err);

    res.status(500).json({
      success: false,
      message: "Parcel creation failed.",
    });
  }
};

// =====================================
// Get Parcel By ID
// =====================================
export const getParcelById = async (req, res) => {
  try {
    const parcel = await parcelService.getParcelById(
      req.params.id
    );

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found.",
      });
    }

    res.status(200).json({
      success: true,
      parcel,
    });
  } catch (err) {
    console.error("Get Parcel Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Get My Bookings
// =====================================
export const getMyBookings = async (req, res) => {
  try {
    const parcels = await parcelService.getCustomerBookings(
      req.decoded.email
    );

    res.status(200).json({
      success: true,
      parcels,
    });
  } catch (err) {
    console.error("Get My Bookings Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
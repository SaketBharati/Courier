import * as adminService from "../services/admin.service.js";

// =====================================
// Get All Users
// =====================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("Get Users Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Get All Parcels
// =====================================
export const getAllParcels = async (req, res) => {
  try {
    const parcels = await adminService.getAllParcels();

    res.status(200).json({
      success: true,
      parcels,
    });
  } catch (err) {
    console.error("Get Parcels Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Update User By Admin
// =====================================
export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      role,
      status,
      statusChangeReason,
      statusChangedBy,
    } = req.body;

    if (!statusChangeReason || !statusChangedBy) {
      return res.status(400).json({
        success: false,
        message: "Status change reason and changed by are required.",
      });
    }

    const result = await adminService.updateUserByAdmin(
      id,
      role,
      status,
      statusChangeReason,
      statusChangedBy
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Update User Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Assign Agent To Parcel
// =====================================
export const assignAgentToParcel = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentEmail } = req.body;

    if (!agentEmail) {
      return res.status(400).json({
        success: false,
        message: "Agent email is required.",
      });
    }

    const result = await adminService.assignAgentToParcel(
      id,
      agentEmail
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Agent assigned successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Assign Agent Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Dashboard Metrics
// =====================================
export const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await adminService.getDashboardMetrics();

    res.status(200).json({
      success: true,
      ...metrics,
    });
  } catch (err) {
    console.error("Dashboard Metrics Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
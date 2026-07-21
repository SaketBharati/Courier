import * as userService from "../services/user.service.js";

// =====================================
// Get Current User
// =====================================
export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(
      req.decoded.email
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Get User Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Update User
// =====================================
export const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(
      req.params.email,
      req.body
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
// Upload Avatar
// =====================================
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const result = await userService.uploadAvatar(
      req.params.id,
      req.file
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully.",
    });
  } catch (err) {
    console.error("Upload Avatar Error:", err);

    res.status(500).json({
      success: false,
      message: "Avatar upload failed.",
    });
  }
};

// =====================================
// Upload Banner
// =====================================
export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const result = await userService.uploadBanner(
      req.params.id,
      req.file
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner uploaded successfully.",
    });
  } catch (err) {
    console.error("Upload Banner Error:", err);

    res.status(500).json({
      success: false,
      message: "Banner upload failed.",
    });
  }
};

// =====================================
// Get Avatar
// =====================================
export const getAvatar = async (req, res) => {
  try {
    const user = await userService.getAvatar(req.params.id);

    if (!user?.avatar?.data) {
      return res.status(404).json({
        success: false,
        message: "Avatar not found.",
      });
    }

    res.set("Content-Type", user.avatar.contentType);
    res.send(user.avatar.data);
  } catch (err) {
    console.error("Get Avatar Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve avatar.",
    });
  }
};

// =====================================
// Get Banner
// =====================================
export const getBanner = async (req, res) => {
  try {
    const user = await userService.getBanner(req.params.id);

    if (!user?.banner?.data) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    res.set("Content-Type", user.banner.contentType);
    res.send(user.banner.data);
  } catch (err) {
    console.error("Get Banner Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve banner.",
    });
  }
};
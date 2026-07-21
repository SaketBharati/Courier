import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import * as userController from "../controllers/user.controller.js";
import {
  uploadAvatar,
  uploadBanner,
} from "../config/multer.js";

const router = express.Router();

// =====================================
// User Profile
// =====================================

// Get current logged-in user
router.get(
  "/me",
  verifyToken,
  userController.getUser
);

// Update user profile
router.put(
  "/:email",
  verifyToken,
  userController.updateUser
);

// =====================================
// Avatar
// =====================================

// Upload avatar
router.post(
  "/avatar/:id",
  verifyToken,
  uploadAvatar.single("avatar"),
  userController.uploadAvatar
);

// Get avatar
router.get(
  "/avatar/:id",
  userController.getAvatar
);

// =====================================
// Banner
// =====================================

// Upload banner
router.post(
  "/banner/:id",
  verifyToken,
  uploadBanner.single("banner"),
  userController.uploadBanner
);

// Get banner
router.get(
  "/banner/:id",
  userController.getBanner
);

export default router;
import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

// ==================================
// Register
// ==================================
export const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json(result);
  } catch (err) {
    console.error("Register Error:", err);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ==================================
// Login
// ==================================
export const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json(result);
  } catch (err) {
    console.error("Login Error:", err);

    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

// ==================================
// Refresh Token
// ==================================
export const refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing.",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (error, decoded) => {
        if (error) {
          return res.status(403).json({
            success: false,
            message: "Invalid refresh token.",
          });
        }

        const payload = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };

        const accessToken = jwt.sign(
          payload,
          process.env.JWT_ACCESS_SECRET,
          {
            expiresIn:
              process.env.JWT_ACCESS_EXPIRES_IN || "30d",
          }
        );

        return res.status(200).json({
          success: true,
          message: "Access token refreshed successfully.",
          accessToken,
        });
      }
    );
  } catch (err) {
    console.error("Refresh Token Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ==================================
// Create JWT
// ==================================
export const createJWT = (req, res) => {
  try {
    const token = jwt.sign(
      req.body,
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn:
          process.env.JWT_ACCESS_EXPIRES_IN || "30d",
      }
    );

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    console.error("JWT Creation Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to generate token.",
    });
  }
};

// ==================================
// Logout
// ==================================
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
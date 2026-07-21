import jwt from "jsonwebtoken";
import { usersCollection } from "../db/mongo.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import AppError from "../utils/AppError.js";

// ==============================
// Register User
// ==============================
export async function registerUser(userData) {
  const existingUser = await usersCollection.findOne({
    email: userData.email,
  });

  if (existingUser) {
    throw new AppError("User already exists");
  }

  const newUser = {
    ...userData,
    password: await hashPassword(userData.password),
    role: "Customer",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  const result = await usersCollection.insertOne(newUser);

  return {
    success: true,
    message: "User registered successfully.",
    insertedId: result.insertedId,
  };
}

// ==============================
// Login User
// ==============================
export async function loginUser({ email, password }) {
  const user = await usersCollection.findOne({
    email,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError("Invalid email or password");
  }

  const isPasswordCorrect = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password");
  }

  if (user.status !== "active") {
    throw new AppError("Your account has been blocked.");
  }

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "30d",
    }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "365d",
    }
  );

  return {
    success: true,
    message: "Login successful.",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
}
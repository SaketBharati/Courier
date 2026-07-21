import { usersCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

// =====================================
// Get User By Email
// =====================================
export async function getUserByEmail(email) {
  return usersCollection.findOne(
    { email },
    {
      projection: {
        password: 0,
      },
    }
  );
}

// =====================================
// Update User
// =====================================
export async function updateUser(email, updateData) {
  updateData.updatedAt = new Date();

  return usersCollection.updateOne(
    { email },
    {
      $set: updateData,
    }
  );
}

// =====================================
// Upload Avatar
// =====================================
export async function uploadAvatar(userId, file) {
  return usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        avatar: {
          data: file.buffer,
          contentType: file.mimetype,
        },
        updatedAt: new Date(),
      },
    }
  );
}

// =====================================
// Upload Banner
// =====================================
export async function uploadBanner(userId, file) {
  return usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        banner: {
          data: file.buffer,
          contentType: file.mimetype,
        },
        updatedAt: new Date(),
      },
    }
  );
}

// =====================================
// Get Avatar
// =====================================
export async function getAvatar(userId) {
  return usersCollection.findOne(
    { _id: new ObjectId(userId) },
    {
      projection: {
        avatar: 1,
      },
    }
  );
}

// =====================================
// Get Banner
// =====================================
export async function getBanner(userId) {
  return usersCollection.findOne(
    { _id: new ObjectId(userId) },
    {
      projection: {
        banner: 1,
      },
    }
  );
}
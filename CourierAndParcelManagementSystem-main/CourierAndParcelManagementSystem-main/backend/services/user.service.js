import { usersCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";
import {
  uploadImage,
  deleteImage,
} from "../utils/cloudinaryUpload.js";

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
  const data = {
    ...updateData,
    updatedAt: new Date(),
  };

  return usersCollection.updateOne(
    { email },
    {
      $set: data,
    }
  );
}

// =====================================
// Upload Avatar
// =====================================
export async function uploadAvatar(userId, file) {
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Delete previous avatar if it exists
  if (user.avatar?.public_id) {
    await deleteImage(user.avatar.public_id);
  }

  // Upload new avatar
  const uploaded = await uploadImage(file, "avatars");

  await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        avatar: {
          public_id: uploaded.public_id,
          url: uploaded.secure_url,
        },
        updatedAt: new Date(),
      },
    }
  );

  return {
    public_id: uploaded.public_id,
    url: uploaded.secure_url,
  };
}

// =====================================
// Upload Banner
// =====================================
export async function uploadBanner(userId, file) {
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Delete previous banner if it exists
  if (user.banner?.public_id) {
    await deleteImage(user.banner.public_id);
  }

  // Upload new banner
  const uploaded = await uploadImage(file, "banners");

  await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        banner: {
          public_id: uploaded.public_id,
          url: uploaded.secure_url,
        },
        updatedAt: new Date(),
      },
    }
  );

  return {
    public_id: uploaded.public_id,
    url: uploaded.secure_url,
  };
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
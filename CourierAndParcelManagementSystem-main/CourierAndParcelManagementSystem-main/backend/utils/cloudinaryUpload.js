import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

/**
 * Upload a file buffer to Cloudinary
 * @param {Object} file - Multer file object
 * @param {String} folder - Cloudinary folder
 * @returns {Promise<Object>}
 */
export const uploadImage = (file, folder = "parcel-management") => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId);
};

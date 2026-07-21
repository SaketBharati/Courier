import multer from "multer";

// Store files in memory (ideal for MongoDB Buffer storage)
const storage = multer.memoryStorage();

// Reusable image filter
const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }

  cb(null, true);
};

// Helper function to avoid repeating the same multer configuration
const createUploader = (fieldName, maxSize = 5 * 1024 * 1024) => {
  return multer({
    storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(fieldName);
};

// Avatar upload (5MB)
export const uploadAvatar = createUploader("avatar");

// Banner upload (5MB)
export const uploadBanner = createUploader("banner");

// Parcel image upload (10MB)
export const uploadParcelImage = createUploader(
  "parcel",
  10 * 1024 * 1024
);

// Generic single image upload (5MB)
export const uploadImage = createUploader("image");

// Multiple image upload (maximum 5 images, 10MB each)
export const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).array("images", 5);
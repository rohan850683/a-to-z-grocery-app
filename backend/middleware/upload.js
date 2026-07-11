const multer = require("multer");
const path = require("path");

// Cloudinary upload ke liye file RAM me temporarily store hogi
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpg|jpeg|png|webp/;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const extensionValid = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeTypeValid = allowedMimeTypes.includes(file.mimetype);

  if (extensionValid && mimeTypeValid) {
    return cb(null, true);
  }

  return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed!"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
  },
});

module.exports = upload;
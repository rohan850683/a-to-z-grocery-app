const cloudinary = require("../config/cloudinary");

const getPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
    return null;
  }

  const uploadPart = imageUrl.split("/upload/")[1];

  if (!uploadPart) {
    return null;
  }

  const withoutVersion = uploadPart.replace(/^v\d+\//, "");
  const publicIdWithExtension = withoutVersion.split("?")[0];

  return publicIdWithExtension.replace(/\.[^/.]+$/, "");
};

const deleteFromCloudinary = async (imageUrl) => {
  const publicId = getPublicIdFromUrl(imageUrl);

  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};

module.exports = deleteFromCloudinary;
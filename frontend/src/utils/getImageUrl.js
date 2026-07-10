const API_ORIGIN = "http://localhost:5000";

export const getImageUrl = (image) => {
  if (!image) return "/placeholder.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${API_ORIGIN}${image}`;
  }

  if (image.startsWith("uploads")) {
    return `${API_ORIGIN}/${image}`;
  }

  return `${API_ORIGIN}/uploads/products/${image}`;
};
const API_ORIGIN =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "https://a-to-z-grocery-app.onrender.com";

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
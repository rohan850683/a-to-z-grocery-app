import api from "./api";

// ⭐ Add or Update Review
export const addReview = async (reviewData) => {
  const res = await api.post("/reviews", reviewData);
  return res.data;
};

// ⭐ Get Product Reviews
export const getProductReviews = async (productId) => {
  const res = await api.get(`/reviews/${productId}`);
  return res.data;
};
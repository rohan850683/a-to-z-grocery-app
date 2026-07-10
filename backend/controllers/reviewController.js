const Review = require("../models/Review");
const Product = require("../models/Product");

// ✅ Add / Update Review
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product ID and rating are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let review = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (review) {
      review.rating = rating;
      review.comment = comment || "";
      await review.save();

      return res.json({
        success: true,
        message: "Review updated successfully",
        review,
      });
    }

    review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment: comment || "",
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.log("Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding review",
    });
  }
};

// ✅ Get Reviews By Product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews
        : 0;

    res.json({
      success: true,
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.log("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reviews",
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
};
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const getMyWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    res.json({
      success: true,
      products: wishlist.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    const exists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate("products");

    res.json({
      success: true,
      products: updatedWishlist.products,
      isWishlisted: !exists,
      message: exists
        ? "Removed from wishlist"
        : "Added to wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update wishlist",
    });
  }
};

module.exports = {
  getMyWishlist,
  toggleWishlist,
};
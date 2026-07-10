const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  try {
    const { category, search, trending, bestseller, limit } = req.query;
    const query = {};

    if (category) query.category = category;
    if (trending) query.trending = trending === "true";
    if (bestseller) query.bestseller = bestseller === "true";
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 0);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(8)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const image = req.file ? `/uploads/products/${req.file.filename}` : "";

    const product = await Product.create({
      ...req.body,
      image,
      trending: req.body.trending === "true" || req.body.trending === true,
      bestseller: req.body.bestseller === "true" || req.body.bestseller === true,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    if (updateData.trending !== undefined) {
      updateData.trending = updateData.trending === "true" || updateData.trending === true;
    }

    if (updateData.bestseller !== undefined) {
      updateData.bestseller =
        updateData.bestseller === "true" || updateData.bestseller === true;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
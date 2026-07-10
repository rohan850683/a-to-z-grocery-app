const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes
router.get("/", getAllProducts);
router.get("/:id/similar", getSimilarProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
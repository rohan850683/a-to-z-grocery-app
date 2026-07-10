const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  verifyPayment,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/auth");

// User routes
router.post("/", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/my-orders", protect, getMyOrders);

// Live tracking / single order
router.get("/:id", protect, getOrderById);

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
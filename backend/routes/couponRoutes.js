const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/couponController");

const { protect, adminOnly } = require("../middleware/auth");

// User route
router.post("/validate", protect, validateCoupon);

// Admin routes
router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getAllCoupons);
router.get("/:id", protect, adminOnly, getCouponById);
router.put("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

module.exports = router;
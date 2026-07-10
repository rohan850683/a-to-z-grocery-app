const Coupon = require("../models/Coupon");

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Admin
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      perUserLimit,
      startDate,
      expiryDate,
      isActive,
    } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon code, discount type, discount value and expiry date are required",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Discount type must be percentage or fixed",
      });
    }

    if (Number(discountValue) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0",
      });
    }

    if (discountType === "percentage" && Number(discountValue) > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot be greater than 100",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingCoupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      description: description || "",
      discountType,
      discountValue: Number(discountValue),
      minimumOrderAmount: Number(minimumOrderAmount) || 0,
      maximumDiscountAmount:
        maximumDiscountAmount === "" ||
        maximumDiscountAmount === null ||
        maximumDiscountAmount === undefined
          ? null
          : Number(maximumDiscountAmount),
      usageLimit:
        usageLimit === "" || usageLimit === null || usageLimit === undefined
          ? null
          : Number(usageLimit),
      perUserLimit: Number(perUserLimit) || 1,
      startDate: startDate || new Date(),
      expiryDate,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating coupon",
      error: error.message,
    });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("usedBy.user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Get coupons error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching coupons",
      error: error.message,
    });
  }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Admin
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate(
      "usedBy.user",
      "name email"
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("Get coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching coupon",
      error: error.message,
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Admin
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      perUserLimit,
      startDate,
      expiryDate,
      isActive,
    } = req.body;

    if (
      discountType !== undefined &&
      !["percentage", "fixed"].includes(discountType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount type must be percentage or fixed",
      });
    }

    if (discountValue !== undefined && Number(discountValue) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0",
      });
    }

    const finalDiscountType = discountType || coupon.discountType;
    const finalDiscountValue =
      discountValue !== undefined
        ? Number(discountValue)
        : coupon.discountValue;

    if (
      finalDiscountType === "percentage" &&
      Number(finalDiscountValue) > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot be greater than 100",
      });
    }

    if (code !== undefined) {
      const normalizedCode = code.trim().toUpperCase();

      const existingCoupon = await Coupon.findOne({
        code: normalizedCode,
        _id: { $ne: coupon._id },
      });

      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }

      coupon.code = normalizedCode;
    }

    if (description !== undefined) {
      coupon.description = description;
    }

    if (discountType !== undefined) {
      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      coupon.discountValue = Number(discountValue);
    }

    if (minimumOrderAmount !== undefined) {
      coupon.minimumOrderAmount = Number(minimumOrderAmount) || 0;
    }

    if (maximumDiscountAmount !== undefined) {
      coupon.maximumDiscountAmount =
        maximumDiscountAmount === "" || maximumDiscountAmount === null
          ? null
          : Number(maximumDiscountAmount);
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit =
        usageLimit === "" || usageLimit === null ? null : Number(usageLimit);
    }

    if (perUserLimit !== undefined) {
      coupon.perUserLimit = Number(perUserLimit) || 1;
    }

    if (startDate !== undefined) {
      coupon.startDate = startDate;
    }

    if (expiryDate !== undefined) {
      coupon.expiryDate = expiryDate;
    }

    if (isActive !== undefined) {
      coupon.isActive = isActive;
    }

    const updatedCoupon = await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating coupon",
      error: error.message,
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await coupon.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting coupon",
      error: error.message,
    });
  }
};

// @desc    Validate and calculate coupon discount
// @route   POST /api/coupons/validate
// @access  User
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || orderAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and order amount are required",
      });
    }

    const amount = Number(orderAmount);

    if (Number.isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order amount must be greater than 0",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    const now = new Date();

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is inactive",
      });
    }

    if (coupon.startDate && now < coupon.startDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon is not active yet",
      });
    }

    if (coupon.expiryDate && now > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired",
      });
    }

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit has been reached",
      });
    }

    if (amount < coupon.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is ₹${coupon.minimumOrderAmount}`,
      });
    }

    if (req.user) {
      const userUsage = coupon.usedBy.find(
        (entry) => entry.user.toString() === req.user._id.toString()
      );

      if (
        userUsage &&
        userUsage.usageCount >= coupon.perUserLimit
      ) {
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon maximum times",
        });
      }
    }

    const discountAmount = coupon.calculateDiscount(amount);
    const finalAmount = Math.max(amount - discountAmount, 0);

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      orderAmount: amount,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while validating coupon",
      error: error.message,
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
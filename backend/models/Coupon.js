const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Discount type is required"],
    },

    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },

    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },

    maximumDiscountAmount: {
      type: Number,
      default: null,
      min: [0, "Maximum discount amount cannot be negative"],
    },

    usageLimit: {
      type: Number,
      default: null,
      min: [1, "Usage limit must be at least 1"],
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    perUserLimit: {
      type: Number,
      default: 1,
      min: [1, "Per user limit must be at least 1"],
    },

    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usageCount: {
          type: Number,
          default: 1,
        },
      },
    ],

    startDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      required: [true, "Coupon expiry date is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);



couponSchema.methods.isValidCoupon = function () {
  const now = new Date();

  if (!this.isActive) {
    return false;
  }

  if (this.startDate && now < this.startDate) {
    return false;
  }

  if (this.expiryDate && now > this.expiryDate) {
    return false;
  }

  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
    return false;
  }

  return true;
};

couponSchema.methods.calculateDiscount = function (orderAmount) {
  let discountAmount = 0;

  if (this.discountType === "percentage") {
    discountAmount = (orderAmount * this.discountValue) / 100;

    if (
      this.maximumDiscountAmount !== null &&
      discountAmount > this.maximumDiscountAmount
    ) {
      discountAmount = this.maximumDiscountAmount;
    }
  }

  if (this.discountType === "fixed") {
    discountAmount = this.discountValue;
  }

  if (discountAmount > orderAmount) {
    discountAmount = orderAmount;
  }

  return Math.round(discountAmount);
};

module.exports = mongoose.model("Coupon", couponSchema);
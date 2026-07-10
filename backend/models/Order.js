const mongoose = require("mongoose");

// Order ke andar save hone wale har product ka schema
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },

    selectedOption: {
      type: String,
      default: "1 pcs",
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Product price cannot be negative"],
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      trim: true,
      default: "",
    },

    customerMobile: {
      type: String,
      trim: true,
      default: "",
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    // Products ka total coupon discount se pehle
    subTotal: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Subtotal cannot be negative"],
    },

    // Coupon se mila total discount
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },

    // Applied coupon code
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    // Discount ke baad customer ko pay karne wala final amount
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "packed",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },

    paymentMethod: {
      type: String,
      enum: [
        "Cash on Delivery",
        "Online Payment",
        "Demo UPI",
        "Demo Card",
      ],
      default: "Cash on Delivery",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Real Razorpay payment fields
    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    // College project ke demo payment fields
    isDemoPayment: {
      type: Boolean,
      default: false,
    },

    demoTransactionId: {
      type: String,
      default: "",
    },

    demoUpiId: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Admin order list aur user order history ke liye useful indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ couponCode: 1 });

module.exports = mongoose.model("Order", orderSchema);
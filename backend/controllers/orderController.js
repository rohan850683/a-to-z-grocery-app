const crypto = require("crypto");

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

const sendEmail = require("../utils/sendEmail");

const {
  orderPlacedTemplate,
  orderStatusTemplate,
  orderDeliveredTemplate,
} = require("../utils/emailTemplates");

// ₹499 ya usse zyada ke order par free delivery
const FREE_DELIVERY_MINIMUM = 499;
const DELIVERY_CHARGE = 40;

// Demo transaction ID
const generateDemoTransactionId = () => {
  return `demo_txn_${Date.now()}_${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};

// Order status ko readable format me convert karna
const getReadableStatus = (status = "") => {
  const statusNames = {
    placed: "Placed",
    confirmed: "Confirmed",
    packed: "Packed",
    "out-for-delivery": "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return statusNames[status] || status;
};

// Product ka secure price database se nikalna
const getProductSellingPrice = (product) => {
  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;

  if (discountPrice > 0 && discountPrice < price) {
    return discountPrice;
  }

  return price;
};

// ✅ Create Order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      customerName,
      customerPhone,
      customerMobile,
      demoUpiId,
      couponCode,
    } = req.body;

    /*
     * Frontend ke totalAmount, discount aur product price ko
     * trust nahi kiya jayega.
     */

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const allowedPaymentMethods = [
      "Cash on Delivery",
      "Online Payment",
      "Demo UPI",
      "Demo Card",
    ];

    const finalPaymentMethod =
      paymentMethod || "Cash on Delivery";

    if (!allowedPaymentMethods.includes(finalPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    if (
      finalPaymentMethod === "Demo UPI" &&
      (!demoUpiId || !demoUpiId.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a demo UPI ID",
      });
    }

    /*
     * Har item ko database se dobara fetch karke:
     * - Product existence check hoga
     * - Correct price li jayegi
     * - Fake frontend price remove hoga
     * - Stock check hoga
     */
    const secureOrderItems = [];
    let productsSubTotal = 0;

    for (const item of items) {
      const productId =
        item.product?._id ||
        item.product ||
        item._id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Invalid product found in order",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "One or more products no longer exist",
        });
      }

      const quantity = Math.max(
        1,
        Math.floor(Number(item.quantity) || 1)
      );

      if (
        typeof product.stock === "number" &&
        product.stock < quantity
      ) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) available`,
        });
      }

      const securePrice = getProductSellingPrice(product);

      if (securePrice <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.name}`,
        });
      }

      productsSubTotal += securePrice * quantity;

      secureOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.image || "",
        quantity,
        selectedOption:
          item.selectedOption ||
          product.unit ||
          "1 pcs",
        price: securePrice,
      });
    }

    productsSubTotal = Math.round(productsSubTotal);

    /*
     * Delivery charge bhi backend calculate karega.
     * Frontend se delivery charge trust nahi kiya jayega.
     */
    const deliveryCharge =
      productsSubTotal >= FREE_DELIVERY_MINIMUM
        ? 0
        : DELIVERY_CHARGE;

    let discount = 0;
    let finalCouponCode = "";
    let appliedCoupon = null;
    let userCouponRecord = null;

    /*
     * Coupon bheja gaya hai to backend par complete validation.
     */
    if (
      couponCode &&
      typeof couponCode === "string" &&
      couponCode.trim()
    ) {
      finalCouponCode = couponCode
        .trim()
        .toUpperCase();

      appliedCoupon = await Coupon.findOne({
        code: finalCouponCode,
      });

      if (!appliedCoupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        });
      }

      if (!appliedCoupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "This coupon is inactive",
        });
      }

      const currentDate = new Date();

      if (
        appliedCoupon.startDate &&
        currentDate < appliedCoupon.startDate
      ) {
        return res.status(400).json({
          success: false,
          message: "This coupon has not started yet",
        });
      }

      if (
        appliedCoupon.expiryDate &&
        currentDate > appliedCoupon.expiryDate
      ) {
        return res.status(400).json({
          success: false,
          message: "This coupon has expired",
        });
      }

      if (
        appliedCoupon.usageLimit !== null &&
        appliedCoupon.usedCount >=
          appliedCoupon.usageLimit
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit has been reached",
        });
      }

      if (
        productsSubTotal <
        Number(appliedCoupon.minimumOrderAmount || 0)
      ) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount for this coupon is ₹${appliedCoupon.minimumOrderAmount}`,
        });
      }

      userCouponRecord = appliedCoupon.usedBy.find(
        (record) =>
          record.user &&
          record.user.toString() ===
            req.user._id.toString()
      );

      const currentUserUsage =
        userCouponRecord?.usageCount || 0;

      if (
        currentUserUsage >=
        Number(appliedCoupon.perUserLimit || 1)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You have already reached the usage limit for this coupon",
        });
      }

      discount =
        appliedCoupon.calculateDiscount(
          productsSubTotal
        );

      discount = Math.max(
        0,
        Math.min(discount, productsSubTotal)
      );
    }

    /*
     * Coupon products subtotal par lagega.
     * Delivery charge discount ke baad add hoga.
     */
    const finalAmount = Math.max(
      0,
      productsSubTotal - discount + deliveryCharge
    );

    const isDemoPayment =
      finalPaymentMethod === "Demo UPI" ||
      finalPaymentMethod === "Demo Card";

    let paymentStatus = "pending";
    let demoTransactionId = "";

    if (isDemoPayment) {
      paymentStatus = "paid";
      demoTransactionId =
        generateDemoTransactionId();
    }

    if (
      finalPaymentMethod === "Cash on Delivery" ||
      finalPaymentMethod === "Online Payment"
    ) {
      paymentStatus = "pending";
    }

    /*
     * Secure calculated values ke saath order create hoga.
     */
    const order = await Order.create({
      user: req.user._id,

      customerName:
        customerName?.trim() ||
        req.user.name ||
        "",

      customerMobile:
        customerMobile?.trim() ||
        customerPhone?.trim() ||
        req.user.mobile ||
        "",

      items: secureOrderItems,

      subTotal: productsSubTotal,

      discount,

      couponCode: finalCouponCode,

      totalAmount: finalAmount,

      deliveryAddress: deliveryAddress.trim(),

      paymentMethod: finalPaymentMethod,

      paymentStatus,

      isDemoPayment,

      demoTransactionId,

      demoUpiId:
        finalPaymentMethod === "Demo UPI"
          ? demoUpiId.trim()
          : "",

      razorpayOrderId: "",
      razorpayPaymentId: "",
      razorpaySignature: "",

      status: "placed",
    });

    /*
     * Order successfully create hone ke baad hi:
     * - Total coupon usedCount increase hoga
     * - User-wise usageCount increase hoga
     */
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;

      if (userCouponRecord) {
        userCouponRecord.usageCount += 1;
      } else {
        appliedCoupon.usedBy.push({
          user: req.user._id,
          usageCount: 1,
        });
      }

      await appliedCoupon.save();
    }

    /*
     * Stock decrease karna.
     */
    for (const orderedItem of secureOrderItems) {
      await Product.findByIdAndUpdate(
        orderedItem.product,
        {
          $inc: {
            stock: -orderedItem.quantity,
          },
        }
      );
    }

    /*
     * Order create hone ke baad email.
     * Email fail hone par order delete nahi hoga.
     */
    try {
      const user = await User.findById(
        req.user._id
      );

      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject:
            "Order Placed Successfully - A to Z Grocery",
          text: `Your order ${order._id} has been placed successfully.`,
          html: orderPlacedTemplate(order),
        });
      } else {
        console.log(
          "Order email not sent: User email not found"
        );
      }
    } catch (emailError) {
      console.error(
        "Order Placed Email Error:",
        emailError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: isDemoPayment
        ? "Demo payment successful and order created"
        : "Order created successfully",

      pricing: {
        subTotal: productsSubTotal,
        deliveryCharge,
        discount,
        couponCode: finalCouponCode,
        finalAmount,
      },

      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
  }
};

// ✅ Verify real Razorpay Payment
const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification details are missing",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to verify this order",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret is not configured",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      generatedSignature !== razorpay_signature
    ) {
      order.paymentStatus = "failed";
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
        order,
      });
    }

    order.paymentStatus = "paid";
    order.paymentMethod = "Online Payment";
    order.razorpayOrderId =
      razorpay_order_id;
    order.razorpayPaymentId =
      razorpay_payment_id;
    order.razorpaySignature =
      razorpay_signature;
    order.isDemoPayment = false;

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Payment Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Payment verification failed",
      error: error.message,
    });
  }
};

// ✅ Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get My Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching orders",
      error: error.message,
    });
  }
};

// ✅ Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate(
      "user",
      "name email mobile"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderUserId =
      order.user?._id?.toString() ||
      order.user?.toString();

    if (
      req.user.role !== "admin" &&
      orderUserId !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching order",
      error: error.message,
    });
  }
};

// ✅ Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email mobile"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get All Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching all orders",
      error: error.message,
    });
  }
};

// ✅ Admin: Update order status
const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "placed",
      "confirmed",
      "packed",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousStatus = order.status;

    order.status = status;
    await order.save();

    if (previousStatus !== status) {
      try {
        const user = await User.findById(
          order.user
        );

        if (user?.email) {
          const readableStatus =
            getReadableStatus(status);

          if (status === "delivered") {
            await sendEmail({
              to: user.email,
              subject:
                "Order Delivered Successfully - A to Z Grocery",
              text: `Your order ${order._id} has been delivered successfully.`,
              html: orderDeliveredTemplate(
                order
              ),
            });
          } else {
            await sendEmail({
              to: user.email,
              subject: `Order Status Updated: ${readableStatus}`,
              text: `Your order ${order._id} status is now ${readableStatus}.`,
              html: orderStatusTemplate(
                order,
                readableStatus
              ),
            });
          }
        } else {
          console.log(
            "Status email not sent: User email not found"
          );
        }
      } catch (emailError) {
        console.error(
          "Order Status Email Error:",
          emailError.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating order status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaysOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    const topSellingProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          image: "$product.image",
          price: "$product.price",
          totalSold: 1,
        },
      },
    ]);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
      });

      const revenue = orders.reduce(
        (total, order) => total + (order.totalAmount || 0),
        0
      );

      last7Days.push({
        day: date.toLocaleDateString("en-IN", { weekday: "short" }),
        orders: orders.length,
        revenue,
      });
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        todaysOrders,
        recentOrders,
        topSellingProducts,
        salesChart: last7Days,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
    });
  }
};

module.exports = {
  getDashboardAnalytics,
};
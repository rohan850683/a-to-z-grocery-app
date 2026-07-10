import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import { getDashboardAnalytics } from "../services/analyticsService.js";
import AdminLayout from "../components/AdminLayout";

const BASE_URL = "http://localhost:5000";

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getDashboardAnalytics();
        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Dashboard Analytics Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: analytics?.totalProducts || 0,
      icon: "📦",
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders || 0,
      icon: "🛒",
      color: "text-green-600",
    },
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: "👥",
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `₹${analytics?.totalRevenue || 0}`,
      icon: "💰",
      color: "text-yellow-600",
    },
    {
      title: "Today's Orders",
      value: analytics?.todaysOrders || 0,
      icon: "📈",
      color: "text-red-600",
    },
  ];

  const revenueChartData = useMemo(() => {
    if (!analytics?.recentOrders?.length) return [];

    const grouped = {};

    analytics.recentOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      grouped[date] = (grouped[date] || 0) + (order.totalAmount || 0);
    });

    return Object.keys(grouped).map((date) => ({
      date,
      revenue: grouped[date],
    }));
  }, [analytics]);

  const orderStatusData = useMemo(() => {
    if (!analytics?.recentOrders?.length) return [];

    const grouped = {};

    analytics.recentOrders.forEach((order) => {
      const status = order.status || "Pending";
      grouped[status] = (grouped[status] || 0) + 1;
    });

    return Object.keys(grouped).map((status) => ({
      name: status,
      value: grouped[status],
    }));
  }, [analytics]);

  if (user?.role !== "admin") {
    return (
      <div className="container-app py-24 text-center">
        <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
        <p className="mt-2">Only admin can open this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <h1 className="text-2xl font-bold text-green-700">
            Loading Dashboard...
          </h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-2 md:p-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            🛠️ Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome back, {user?.name}. Here is your live store overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
                    {card.value}
                  </h2>
                </div>

                <div className="text-4xl">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-5">📊 Revenue Chart</h2>

            {revenueChartData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Bar
                      dataKey="revenue"
                      fill="#22c55e"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No revenue data found.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-5">🥧 Order Status Chart</h2>

            {orderStatusData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No order status data found.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-5">⭐ Recent Orders</h2>

            {analytics?.recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        Order ID: {order._id?.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">
                        User: {order.user?.name || "Guest User"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {order.status || "Pending"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{order.totalAmount || 0}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent orders found.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-5">🔥 Top Selling Products</h2>

            {analytics?.topSellingProducts?.length > 0 ? (
              <div className="space-y-4">
                {analytics.topSellingProducts.map((product) => (
                  <div
                    key={product._id}
                    className="border rounded-xl p-4 flex items-center gap-4"
                  >
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Price: ₹{product.price}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        {product.totalSold || 0}
                      </p>
                      <p className="text-xs text-gray-400">Sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No top selling products found.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
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
import AdminLayout from "../components/AdminLayout";
import { getDashboardAnalytics } from "../services/analyticsService";

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getDashboardAnalytics();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Analytics Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

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

  const topProductsData = useMemo(() => {
    if (!analytics?.topSellingProducts?.length) return [];

    return analytics.topSellingProducts.map((product) => ({
      name: product.name,
      sold: product.totalSold || 0,
    }));
  }, [analytics]);

  const totalProducts = analytics?.totalProducts || 0;
  const totalOrders = analytics?.totalOrders || 0;
  const totalUsers = analytics?.totalUsers || 0;
  const totalRevenue = analytics?.totalRevenue || 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <h1 className="text-2xl font-bold text-green-700">
            Loading Analytics...
          </h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-2 md:p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">📊 Analytics</h1>
          <p className="text-gray-500 mt-2">
            Monitor store performance, orders and product sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Products</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalProducts}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Orders</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Users</p>
            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {totalUsers}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Revenue</p>
            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              ₹{totalRevenue}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">🥧 Order Status Analytics</h2>

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

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">🔥 Top Selling Products</h2>

            {topProductsData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="sold"
                      fill="#f97316"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No top selling data found.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">📌 Store Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Total Products Added</p>
              <h3 className="text-2xl font-bold">{totalProducts}</h3>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Total Completed Orders</p>
              <h3 className="text-2xl font-bold">{totalOrders}</h3>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Registered Users</p>
              <h3 className="text-2xl font-bold">{totalUsers}</h3>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Lifetime Revenue</p>
              <h3 className="text-2xl font-bold">₹{totalRevenue}</h3>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
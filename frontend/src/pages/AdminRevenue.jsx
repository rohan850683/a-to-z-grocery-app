import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import AdminLayout from "../components/AdminLayout";
import { getDashboardAnalytics } from "../services/analyticsService";

export default function AdminRevenue() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const data = await getDashboardAnalytics();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Revenue Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

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

  const totalRevenue = analytics?.totalRevenue || 0;
  const totalOrders = analytics?.totalOrders || 0;
  const todaysOrders = analytics?.todaysOrders || 0;
  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <h1 className="text-2xl font-bold text-green-700">
            Loading Revenue...
          </h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-2 md:p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">💰 Revenue</h1>
          <p className="text-gray-500 mt-2">
            Track sales, income and order revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{totalRevenue}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Today Orders</p>
            <h2 className="text-3xl font-bold text-orange-600 mt-2">
              {todaysOrders}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Average Order</p>
            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              ₹{averageOrderValue}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">📊 Revenue Bar Chart</h2>

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

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">📈 Revenue Line Chart</h2>

            {revenueChartData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#16a34a"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No revenue data found.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-5">🧾 Recent Revenue Orders</h2>

          {analytics?.recentOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {analytics.recentOrders.map((order) => (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-semibold">
                        #{order._id?.slice(-6)}
                      </td>
                      <td className="p-4">
                        {order.user?.name || "Guest User"}
                      </td>
                      <td className="p-4">
                        {order.paymentMethod || "Cash on Delivery"}
                      </td>
                      <td className="p-4 capitalize">
                        {order.status || "Pending"}
                      </td>
                      <td className="p-4 font-bold text-green-600">
                        ₹{order.totalAmount || 0}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No recent orders found.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
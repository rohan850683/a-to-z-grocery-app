import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my-orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading your orders...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-600 mb-4">You have no orders yet.</p>

          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-5 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">{order._id}</p>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold capitalize w-fit">
                  {order.status?.replaceAll("_", " ") || "placed"}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-5">
                <p className="font-bold text-lg">
                  Total: ₹{order.totalAmount}
                </p>

                <Link
                  to={`/track-order/${order._id}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-center font-semibold"
                >
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
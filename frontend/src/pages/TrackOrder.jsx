import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const steps = [
  { key: "placed", label: "Order Placed" },
  { key: "confirmed", label: "Order Confirmed" },
  { key: "packed", label: "Order Packed" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="p-6">Loading tracking...</div>;
  }

  const currentIndex = steps.findIndex((step) => step.key === order.status);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Live Delivery Tracking</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="mb-2">
          <b>Order ID:</b> {order._id}
        </p>

        <p className="mb-6">
          <b>Status:</b>{" "}
          <span className="capitalize text-green-600 font-semibold">
            {order.status.replaceAll("_", " ")}
          </span>
        </p>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const active = index <= currentIndex;

            return (
              <div key={step.key} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold ${
                    active ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  {active ? "✓" : index + 1}
                </div>

                <div>
                  <p
                    className={`font-semibold ${
                      active ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {order.status === "out_for_delivery" && (
          <div className="mt-8 bg-green-50 border border-green-200 p-4 rounded-lg">
            🚚 Your delivery partner is on the way.
          </div>
        )}

        {order.status === "delivered" && (
          <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            ✅ Your order has been delivered.
          </div>
        )}
      </div>
    </div>
  );
}
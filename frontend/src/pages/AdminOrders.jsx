import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Package,
  User,
  Phone,
  MapPin,
  Wallet,
  RefreshCw,
  ArrowLeft,
  Bike,
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
} from "lucide-react";

const statusOptions = ["placed", "packing", "out-for-delivery", "delivered"];

const statusColor = {
  placed: "bg-yellow-100 text-yellow-700",
  packing: "bg-blue-100 text-blue-700",
  "out-for-delivery": "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
};

const paymentColor = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-blue-100 text-blue-700",
};

const trackingSteps = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "packing", label: "Packing", icon: ChefHat },
  { key: "out-for-delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const getStatusIndex = (status) =>
  trackingSteps.findIndex((step) => step.key === status);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      
        const res = await api.put(`/orders/${orderId}/status`, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? res.data.order : order))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed.");
    } finally {
      setUpdatingId("");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container-app py-4 md:py-8 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-600 mb-2"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </Link>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink flex items-center gap-2">
            <Package className="text-forest-500" />
            Admin Orders
          </h1>

          <p className="text-sm text-ink/50 mt-1">
            Manage customer orders and live delivery tracking.
          </p>
        </div>

        <button onClick={fetchOrders} className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="card p-4 mb-5 text-red-600 bg-red-50">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-mint animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-10 text-center text-ink/50">No orders found.</div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              updatingId={updatingId}
              updateStatus={updateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, updatingId, updateStatus }) {
  const activeIndex = getStatusIndex(order.status);
  const progressPercent =
    activeIndex <= 0 ? 15 : (activeIndex / (trackingSteps.length - 1)) * 100;

  return (
    <div className="card p-4 md:p-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <p className="font-display font-bold text-lg text-ink">
            Order #{order._id?.slice(-8).toUpperCase()}
          </p>

          <p className="text-xs text-ink/40 mt-1">
            {new Date(order.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <span
            className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full capitalize ${
              statusColor[order.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {order.status?.replaceAll("-", " ")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={order.status}
            disabled={updatingId === order._id}
            onChange={(e) => updateStatus(order._id, e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-forest-100 bg-mint/50 px-4 py-2 text-sm font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-forest-300"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("-", " ")}
              </option>
            ))}
          </select>

          {updatingId === order._id && (
            <span className="text-xs text-ink/50">Updating...</span>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="w-full h-2 bg-mint rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-1 md:gap-2 mt-4">
          {trackingSteps.map((step, index) => {
            const Icon = step.icon;
            const isDone = index <= activeIndex;

            return (
              <div key={step.key} className="text-center">
                <div
                  className={`mx-auto w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                    isDone ? "bg-forest-500 text-white" : "bg-mint text-ink/40"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <p
                  className={`text-[11px] mt-2 font-semibold ${
                    isDone ? "text-forest-700" : "text-ink/40"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="bg-mint/60 rounded-2xl p-4">
          <h3 className="font-bold text-ink mb-3">Customer Details</h3>

          <Info icon={User} label="Name" value={order.user?.name || order.customerName || "N/A"} />
          <Info icon={Phone} label="Phone" value={order.user?.phone || order.customerPhone || "N/A"} />
          <Info icon={MapPin} label="Address" value={order.deliveryAddress || "N/A"} />
          <Info icon={Wallet} label="Payment" value={order.paymentMethod || "Cash on Delivery"} />
        </div>

<div className="mt-4 border-t pt-4">
  <p className="text-xs text-ink/40 mb-2">
    Payment Status
  </p>

  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
      paymentColor[
        order.paymentStatus?.toLowerCase()
      ] || "bg-gray-100 text-gray-600"
    }`}
  >
    {(order.paymentStatus || "pending").toUpperCase()}
  </span>
</div>

{order.demoTransactionId && (
  <div className="mt-4">
    <p className="text-xs text-ink/40">
      Demo Transaction ID
    </p>

    <p className="font-mono text-xs break-all">
      {order.demoTransactionId}
    </p>
  </div>
)}

{order.razorpayPaymentId && (
  <div className="mt-4">
    <p className="text-xs text-ink/40">
      Razorpay Payment ID
    </p>

    <p className="font-mono text-xs break-all">
      {order.razorpayPaymentId}
    </p>
  </div>
)}

        <div className="bg-mint/60 rounded-2xl p-4">
          <h3 className="font-bold text-ink mb-3">Order Items</h3>

          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between gap-3 text-sm flex-wrap">
                <span className="text-ink/70">
                  {item.name} x{item.quantity}
                </span>

                <span className="font-semibold text-ink">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-forest-100 mt-4 pt-4 space-y-2">

  <div className="flex justify-between text-sm">
    <span>Subtotal</span>
    <span>₹{order.subTotal || order.totalAmount}</span>
  </div>

  {order.discount > 0 && (
    <>
      <div className="flex justify-between text-green-700 text-sm">
        <span>
          Coupon
          {order.couponCode
            ? ` (${order.couponCode})`
            : ""}
        </span>

        <span>-₹{order.discount}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>After Discount</span>
        <span>
          ₹
          {(order.subTotal || order.totalAmount) -
            (order.discount || 0)}
        </span>
      </div>
    </>
  )}

  <div className="flex justify-between text-lg font-bold border-t pt-3">
    <span>Total</span>

    <span className="text-forest-700">
      ₹{order.totalAmount}
    </span>
  </div>

</div>
        </div>

        <div className="bg-mint/60 rounded-2xl p-4">
          <h3 className="font-bold text-ink mb-3">Delivery Partner</h3>

          <Info icon={Bike} label="Rider Name" value={order.deliveryPartner?.name || "Assigning soon"} />
          <Info icon={Phone} label="Rider Phone" value={order.deliveryPartner?.phone || "Available soon"} />
          <Info icon={Clock} label="Estimated Time" value={order.estimatedDeliveryTime || "25-30 mins"} />
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 mb-3">
      <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-forest-600 shrink-0">
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-ink/40">{label}</p>
        <p className="text-sm font-semibold text-ink break-words">{value || "N/A"}</p>
      </div>
    </div>
  );
}
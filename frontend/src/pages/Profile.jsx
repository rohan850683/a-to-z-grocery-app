import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Cake,
  LogOut,
  Pencil,
  Package,
  Save,
  X,
  Bike,
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  Wallet,
  ReceiptText,
} from "lucide-react";

const trackingSteps = [
  {
    key: "placed",
    label: "Order Placed",
    icon: Package,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: CheckCircle,
  },
  {
    key: "packed",
    label: "Packed",
    icon: ChefHat,
  },
  {
    key: "out-for-delivery",
    label: "Out for Delivery",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle,
  },
];

const statusColor = {
  placed: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-purple-100 text-purple-700",
  "out-for-delivery": "bg-orange-100 text-orange-700",
  delivered: "bg-green-500 text-white",
  cancelled: "bg-red-100 text-red-700",
};

const paymentColor = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-blue-100 text-blue-700",
};

const normalizeOrderStatus = (status) => {
  if (!status) return "placed";

  if (status === "out_for_delivery") {
    return "out-for-delivery";
  }

  if (status === "packing") {
    return "packed";
  }

  return status;
};

const getStatusIndex = (status) => {
  const normalizedStatus = normalizeOrderStatus(status);

  return trackingSteps.findIndex(
    (step) => step.key === normalizedStatus
  );
};

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    age: "",
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrdersError("");

      const res = await api.get("/orders/my-orders");

      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Orders fetch error:", error);

      setOrders([]);
      setOrdersError(
        error.response?.data?.message ||
          "Could not load your orders."
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || user.mobile || "",
        address: user.address || "",
        age: user.age || "",
      });

      fetchMyOrders();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: form.address,
        age: form.age ? Number(form.age) : "",
      });

      setEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container-app py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <span className="w-20 h-20 rounded-full bg-forest-500 text-white flex items-center justify-center text-3xl font-bold font-display">
              {user.name?.[0]?.toUpperCase() || "U"}
            </span>

            <h1 className="font-display text-xl font-bold text-ink mt-3">
              {user.name || "User"}
            </h1>

            <p className="text-ink/50 text-sm">
              {user.email}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {!editing ? (
              <>
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={user.email}
                />

                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={user.phone || user.mobile}
                />

                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={user.address}
                />

                <InfoRow
                  icon={Cake}
                  label="Age"
                  value={user.age}
                />
              </>
            ) : (
              <>
                <EditRow
                  icon={User}
                  value={form.name}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      name: value,
                    })
                  }
                  placeholder="Name"
                />

                <EditRow
                  icon={Phone}
                  value={form.phone}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      phone: value,
                    })
                  }
                  placeholder="Phone"
                />

                <EditRow
                  icon={MapPin}
                  value={form.address}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      address: value,
                    })
                  }
                  placeholder="Address"
                />

                <EditRow
                  icon={Cake}
                  value={form.age}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      age: value,
                    })
                  }
                  placeholder="Age"
                  type="number"
                />
              </>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 !py-2.5 disabled:opacity-60"
                >
                  <Save size={16} />

                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-outline flex-1 flex items-center justify-center gap-2 !py-2.5"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-outline flex-1 flex items-center justify-center gap-2 !py-2.5"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <Link
            to="/my-orders"
            className="w-full mt-3 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold text-sm py-2.5 rounded-full hover:bg-green-700 transition"
          >
            <Package size={16} />
            My Orders
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-chili-500 font-semibold text-sm mt-3 py-2.5 hover:bg-chili-50 rounded-full transition"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
              <Package className="text-forest-500" />
              My Orders & Tracking
            </h2>

            <button
              type="button"
              onClick={fetchMyOrders}
              className="btn-outline !px-4 !py-2 text-sm"
            >
              Refresh
            </button>
          </div>

          {ordersError && (
            <div className="card p-4 mb-4 bg-red-50 text-red-700 border border-red-200">
              {ordersError}
            </div>
          )}

          {loadingOrders ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 bg-mint rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="card p-10 text-center text-ink/50">
              You haven't placed any orders yet.
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <OrderTrackingCard
                  key={order._id}
                  order={order}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderTrackingCard({ order }) {
  const normalizedStatus = normalizeOrderStatus(
    order.status
  );

  const activeIndex = getStatusIndex(normalizedStatus);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  const progressPercent =
    safeIndex <= 0
      ? 15
      : (safeIndex / (trackingSteps.length - 1)) * 100;

  const paymentStatus = (
    order.paymentStatus || "pending"
  ).toLowerCase();

  return (
    <div className="card p-5">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <p className="font-semibold text-ink">
            Order #
            {order._id?.slice(-8).toUpperCase()}
          </p>

          <p className="text-xs text-ink/40 mt-1">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "Date not available"}
          </p>

          <Link
            to={`/track-order/${order._id}`}
            className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Track Order
          </Link>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
              statusColor[normalizedStatus] ||
              "bg-mint text-ink/60"
            }`}
          >
            {normalizedStatus.replaceAll("-", " ")}
          </span>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              paymentColor[paymentStatus] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            PAYMENT {paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="w-full h-2 bg-mint rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-500 rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-5 gap-2 mt-4">
          {trackingSteps.map((step, index) => {
            const Icon = step.icon;
            const isDone = index <= safeIndex;

            return (
              <div
                key={step.key}
                className="text-center"
              >
                <div
                  className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${
                    isDone
                      ? "bg-forest-500 text-white"
                      : "bg-mint text-ink/40"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <p
                  className={`text-[11px] mt-2 font-semibold ${
                    isDone
                      ? "text-forest-700"
                      : "text-ink/40"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className="bg-mint/60 rounded-2xl p-4">
          <h3 className="font-bold text-ink mb-3">
            Order Items
          </h3>

          <div className="space-y-2">
            {order.items?.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={`${item.product || item.name}-${index}`}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-ink/70">
                    {item.name} × {item.quantity}
                  </span>

                  <span className="font-semibold text-ink">
                    ₹
                    {Number(item.price || 0) *
                      Number(item.quantity || 1)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/50">
                No items found.
              </p>
            )}
          </div>

          <div className="border-t border-forest-100 mt-4 pt-4 flex justify-between font-display font-bold">
            <span>Total</span>

            <span className="text-forest-700">
              ₹{order.totalAmount || 0}
            </span>
          </div>
        </div>

        <div className="bg-mint/60 rounded-2xl p-4">
          <h3 className="font-bold text-ink mb-3">
            Delivery Details
          </h3>

          <InfoRow
            icon={Bike}
            label="Rider Name"
            value={
              order.deliveryPartner?.name ||
              "Assigning soon"
            }
          />

          <InfoRow
            icon={Phone}
            label="Rider Phone"
            value={
              order.deliveryPartner?.phone ||
              "Available soon"
            }
          />

          <InfoRow
            icon={Clock}
            label="Estimated Time"
            value={
              order.estimatedDeliveryTime ||
              "25-30 mins"
            }
          />

          <InfoRow
            icon={MapPin}
            label="Delivery Address"
            value={order.deliveryAddress || "N/A"}
          />
        </div>

        <div className="bg-mint/60 rounded-2xl p-4 md:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="font-bold text-ink">
              Payment Details
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                paymentColor[paymentStatus] ||
                "bg-gray-100 text-gray-600"
              }`}
            >
              {paymentStatus.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InfoRow
              icon={Wallet}
              label="Payment Method"
              value={
                order.paymentMethod ||
                "Cash on Delivery"
              }
            />

            <InfoRow
              icon={CheckCircle}
              label="Payment Status"
              value={paymentStatus.toUpperCase()}
            />

            {order.demoTransactionId && (
              <InfoRow
                icon={ReceiptText}
                label="Demo Transaction ID"
                value={order.demoTransactionId}
              />
            )}

            {order.demoUpiId && (
              <InfoRow
                icon={Phone}
                label="Demo UPI ID"
                value={order.demoUpiId}
              />
            )}

            {order.razorpayPaymentId && (
              <InfoRow
                icon={ReceiptText}
                label="Razorpay Payment ID"
                value={order.razorpayPaymentId}
              />
            )}

            {order.razorpayOrderId && (
              <InfoRow
                icon={Package}
                label="Razorpay Order ID"
                value={order.razorpayOrderId}
              />
            )}
          </div>

          {order.isDemoPayment && (
            <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-sm font-semibold text-blue-800">
                Demo Payment
              </p>

              <p className="text-xs text-blue-700 mt-1">
                This payment was simulated for the
                college project. No real money was charged.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-forest-600 shrink-0">
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-ink/40">
          {label}
        </p>

        <p className="text-sm font-semibold text-ink break-all">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

function EditRow({
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="relative">
      <Icon
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30"
      />

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-forest-100 bg-mint/50 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
      />
    </div>
  );
}
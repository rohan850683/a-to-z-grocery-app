
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

import {
  MapPin,
  Wallet,
  CheckCircle2,
  User,
  Phone,
  Gift,
  PackageCheck,
  Clock,
  ShoppingBag,
  Home,
  Smartphone,
  CreditCard,
  AlertCircle,
  X,
} from "lucide-react";

export default function Checkout() {
  const { cartItems, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.buyNow
    ? location.state.product
    : null;

  const getFinalPrice = (item) => {
    const originalPrice = Number(item?.price) || 0;
    const discountPrice = Number(item?.discountPrice) || 0;

    return discountPrice > 0 ? discountPrice : originalPrice;
  };

  const items = buyNowProduct ? [buyNowProduct] : cartItems || [];

  const totalAmount = buyNowProduct
    ? getFinalPrice(buyNowProduct) *
      Number(buyNowProduct.quantity || 1)
    : Number(totalPrice) || 0;

  const totalQuantity = buyNowProduct
    ? Number(buyNowProduct.quantity || 1)
    : Number(totalItems) || 0;

  const [customerName, setCustomerName] = useState(
    user?.name || ""
  );

  const [phone, setPhone] = useState(
    user?.phone || user?.mobile || ""
  );

  const [address, setAddress] = useState(
    user?.address || ""
  );

  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const [demoUpiId, setDemoUpiId] = useState("");

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [error, setError] = useState("");

  const deliveryFee = totalAmount >= 199 ? 0 : 25;

  const finalTotal = Math.max(
    0,
    totalAmount + deliveryFee - couponDiscount
  );

  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();

    if (!code) {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage("Please enter a coupon code");
      return;
    }

    try {
      setApplyingCoupon(true);
      setCouponMessage("Checking coupon...");
      setError("");

      const response = await api.post("/coupons/validate", {
        code,
        orderAmount: totalAmount,
      });

      const discount = Number(
        response.data?.discountAmount || 0
      );

      setCouponDiscount(discount);
      setCoupon(code);

      setAppliedCoupon({
        id: response.data?.coupon?.id || "",
        code: response.data?.coupon?.code || code,
        discountType:
          response.data?.coupon?.discountType || "",
        discountValue:
          response.data?.coupon?.discountValue || 0,
      });

      setCouponMessage(
        response.data?.message ||
          `Coupon applied! You saved ₹${discount}`
      );
    } catch (err) {
      console.error("Coupon validation error:", err);

      setCouponDiscount(0);
      setAppliedCoupon(null);

      setCouponMessage(
        err.response?.data?.message ||
          "Coupon could not be applied"
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponMessage("");
  };

  const validateDemoUpiId = (upiId) => {
    const upiPattern =
      /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

    return upiPattern.test(upiId.trim());
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter your name");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your delivery address");
      return;
    }

    if (!items || items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (
      paymentMethod === "Demo UPI" &&
      !validateDemoUpiId(demoUpiId)
    ) {
      setError(
        "Please enter a valid demo UPI ID, for example rohan@upi"
      );

      return;
    }

    setError("");
    setPlacing(true);

    try {
      const orderItems = items.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image || "",
        quantity: Number(item.quantity || 1),
        selectedOption: item.unit || "1 pcs",
        price: Number(getFinalPrice(item)),
      }));

      const orderResponse = await api.post("/orders", {
        customerName: customerName.trim(),
        customerPhone: cleanedPhone,
        customerMobile: cleanedPhone,
        deliveryAddress: address.trim(),

        paymentMethod,

        demoUpiId:
          paymentMethod === "Demo UPI"
            ? demoUpiId.trim()
            : "",

        subtotalAmount: totalAmount,
        deliveryFee,
        couponCode: appliedCoupon?.code || "",
        couponDiscount,
        totalAmount: finalTotal,

        items: orderItems,
      });

      if (!orderResponse.data?.order) {
        throw new Error("Order could not be created");
      }

      setPlaced(orderResponse.data.order);

// Order successful hone ke baad coupon clear karo
removeCoupon();

if (!buyNowProduct) {
  clearCart();
}

    } catch (err) {
      console.error("Order error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not place order. Please try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    const paymentStatus =
      placed.paymentStatus || "pending";

    const isPaid = paymentStatus === "paid";

    return (
      <div className="min-h-[80vh] bg-mint/30 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-forest-100 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-green-500 to-forest-500 px-6 py-10 text-center text-white">
              <CheckCircle2
                className="mx-auto mb-4"
                size={72}
              />

              <h1 className="font-display text-3xl font-bold md:text-4xl">
                Order Placed Successfully! 🎉
              </h1>

              <p className="mt-2 text-white/90">
                Thank you{" "}
                {customerName || user?.name || "Customer"}.
                Your order has been received.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4 md:p-8">
              <div className="rounded-2xl border border-forest-100 bg-mint/40 p-5">
                <PackageCheck
                  className="mb-3 text-forest-500"
                  size={28}
                />

                <p className="text-sm text-ink/50">
                  Order ID
                </p>

                <p className="mt-1 font-bold text-ink">
                  #
                  {placed._id
                    ?.slice(-8)
                    .toUpperCase()}
                </p>
              </div>

              <div className="rounded-2xl border border-forest-100 bg-mint/40 p-5">
                <Clock
                  className="mb-3 text-forest-500"
                  size={28}
                />

                <p className="text-sm text-ink/50">
                  Estimated Delivery
                </p>

                <p className="mt-1 font-bold text-ink">
                  10 - 30 minutes
                </p>
              </div>

              <div className="rounded-2xl border border-forest-100 bg-mint/40 p-5">
                <Wallet
                  className="mb-3 text-forest-500"
                  size={28}
                />

                <p className="text-sm text-ink/50">
                  Payment Method
                </p>

                <p className="mt-1 font-bold text-ink">
                  {placed.paymentMethod}
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                    isPaid
                      ? "bg-green-100 text-green-700"
                      : paymentStatus === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {placed.isDemoPayment && (
              <div className="px-6 pb-6 md:px-8">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="shrink-0 text-blue-600"
                      size={22}
                    />

                    <div>
                      <h2 className="font-bold text-blue-900">
                        Demo Payment Completed
                      </h2>

                      <p className="mt-1 text-sm text-blue-700">
                        This was a college-project demo
                        payment. No real money was charged.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 pb-6 md:px-8">
              <div className="rounded-2xl border border-forest-100 p-5">
                <h2 className="mb-4 font-display text-lg font-bold text-ink">
                  Payment Details
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-ink/50">
                      Payment Status
                    </span>

                    <span
                      className={`font-bold ${
                        isPaid
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-ink/50">
                      Payment Method
                    </span>

                    <span className="font-semibold text-ink">
                      {placed.paymentMethod}
                    </span>
                  </div>

                  {placed.demoTransactionId && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-ink/50">
                        Demo Transaction ID
                      </span>

                      <span className="break-all font-mono text-xs sm:text-sm">
                        {placed.demoTransactionId}
                      </span>
                    </div>
                  )}

                  {placed.demoUpiId && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-ink/50">
                        Demo UPI ID
                      </span>

                      <span className="font-semibold">
                        {placed.demoUpiId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 px-6 pb-8 md:px-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-forest-100 p-5">
                <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <MapPin
                    size={20}
                    className="text-forest-500"
                  />
                  Delivery Address
                </h2>

                <p className="leading-relaxed text-ink/70">
                  {placed.deliveryAddress}
                </p>

                <p className="mt-3 text-sm text-ink/50">
                  Phone: {phone}
                </p>
              </div>

              <div className="rounded-2xl border border-forest-100 p-5">
                <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <ShoppingBag
                    size={20}
                    className="text-forest-500"
                  />
                  Order Summary
                </h2>

                <div className="space-y-2 text-sm text-ink/70">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>{totalQuantity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>

                    <span>
                      {deliveryFee === 0
                        ? "FREE"
                        : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>
                        Coupon Discount
                        {appliedCoupon?.code
                          ? ` (${appliedCoupon.code})`
                          : ""}
                      </span>

                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="mt-3 flex justify-between border-t border-forest-100 pt-3 text-lg font-bold text-ink">
                    <span>
                      {isPaid
                        ? "Total Paid"
                        : "Order Total"}
                    </span>

                    <span>₹{placed.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-8 md:px-8">
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <PackageCheck size={18} />
                  View My Orders
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Home size={18} />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <p className="font-display text-2xl font-bold text-ink">
          Your cart is empty
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn-primary mt-6"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="container-app py-4 md:py-8 px-2 sm:px-4">
      <h1 className="mb-5 font-display text-2xl md:text-3xl font-bold text-ink">
        {buyNowProduct
          ? "Buy Now Checkout"
          : "Checkout"}
      </h1>

      <div className="grid grid-cols-1 gap-5 lg:gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-4 md:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
              <User
                size={20}
                className="text-forest-500"
              />
              Customer Details
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-3 text-ink/40"
                />

                <input
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  className="w-full rounded-xl border border-forest-100 bg-mint/50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Enter your name"
                />
              </div>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-3 text-ink/40"
                />

                <input
                  type="tel"
                  value={phone}
                  maxLength={10}
                  onChange={(event) =>
                    setPhone(
                      event.target.value.replace(/\D/g, "")
                    )
                  }
                  className="w-full rounded-xl border border-forest-100 bg-mint/50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </div>
          </div>

          <div className="card p-4 md:p-6">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
              <MapPin
                size={20}
                className="text-forest-500"
              />
              Delivery Address
            </h2>

            <textarea
              rows={3}
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              className="w-full resize-none rounded-xl border border-forest-100 bg-mint/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
              placeholder="Enter your full delivery address"
            />
          </div>

          <div className="card p-4 md:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Wallet
                size={20}
                className="text-forest-500"
              />
              Payment Method
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start md:items-center cursor-pointer gap-3 rounded-xl border-2 px-3 md:px-4 py-4 ${
                  paymentMethod === "Cash on Delivery"
                    ? "border-forest-500 bg-forest-50"
                    : "border-forest-100"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={
                    paymentMethod === "Cash on Delivery"
                  }
                  onChange={() => {
                    setPaymentMethod("Cash on Delivery");
                    setError("");
                  }}
                  className="accent-forest-500"
                />

                <Wallet
                  size={22}
                  className="text-forest-600"
                />

                <div>
                  <p className="font-semibold text-ink">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs text-ink/50">
                    Pay when your order arrives
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start md:items-center cursor-pointer gap-3 rounded-xl border-2 px-3 md:px-4 py-4 ${
                  paymentMethod === "Demo UPI"
                    ? "border-forest-500 bg-forest-50"
                    : "border-forest-100"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "Demo UPI"}
                  onChange={() => {
                    setPaymentMethod("Demo UPI");
                    setError("");
                  }}
                  className="accent-forest-500"
                />

                <Smartphone
                  size={22}
                  className="text-forest-600"
                />

                <div>
                  <p className="font-semibold text-ink">
                    Demo UPI
                  </p>

                  <p className="mt-1 text-xs text-ink/50">
                    Simulate a successful UPI payment
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start md:items-center cursor-pointer gap-3 rounded-xl border-2 px-3 md:px-4 py-4  ${
                  paymentMethod === "Demo Card"
                    ? "border-forest-500 bg-forest-50"
                    : "border-forest-100"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "Demo Card"}
                  onChange={() => {
                    setPaymentMethod("Demo Card");
                    setError("");
                  }}
                  className="accent-forest-500"
                />

                <CreditCard
                  size={22}
                  className="text-forest-600"
                />

                <div>
                  <p className="font-semibold text-ink">
                    Demo Card
                  </p>

                  <p className="mt-1 text-xs text-ink/50">
                    Simulate a successful card payment
                  </p>
                </div>
              </label>
            </div>

            {paymentMethod === "Demo UPI" && (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-ink">
                  Enter Demo UPI ID
                </label>

                <input
                  type="text"
                  value={demoUpiId}
                  onChange={(event) =>
                    setDemoUpiId(event.target.value)
                  }
                  placeholder="Example: rohan@upi"
                  className="w-full rounded-xl border border-forest-100 bg-mint/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                />
              </div>
            )}

            {(paymentMethod === "Demo UPI" ||
              paymentMethod === "Demo Card") && (
              <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-yellow-700"
                  />

                  <div>
                    <p className="font-semibold text-yellow-800">
                      Demo Payment Mode
                    </p>

                    <p className="mt-1 text-xs text-yellow-700">
                      No real money will be charged. This
                      option is only for college-project
                      demonstration.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card p-4 md:p-6">
            <h2 className="mb-3 font-display text-lg font-bold text-ink">
              Items ({totalQuantity})
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 border-b border-forest-100 pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-ink">
                      {item.name}
                    </p>

                    <p className="text-sm text-ink/50">
                      {item.unit || "1 pcs"} · Qty{" "}
                      {item.quantity || 1}
                    </p>
                  </div>

                  <span className="font-semibold">
                    ₹
                    {getFinalPrice(item) *
                      Number(item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card lg:sticky lg:top-24 h-fit p-4 md:p-6">
          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mb-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Gift
                size={20}
                className="text-forest-500"
              />
              Apply Coupon
            </h2>

            {!appliedCoupon ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(event) => {
                    setCoupon(event.target.value);
                    setCouponMessage("");
                  }}
                  placeholder="Enter coupon code"
                  className="min-w-0 flex-1 rounded-xl border border-forest-100 bg-mint/50 px-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-forest-300"
                />

                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={applyingCoupon}
                  className="btn-outline w-full sm:w-auto px-4 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {applyingCoupon
                    ? "Checking..."
                    : "Apply"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <div>
                  <p className="font-bold text-green-800">
                    {appliedCoupon.code}
                  </p>

                  <p className="text-xs text-green-700">
                    You saved ₹{couponDiscount}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeCoupon}
                  className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                  title="Remove coupon"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {couponMessage && (
              <p
                className={`mt-2 text-sm ${
                  appliedCoupon
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {couponMessage}
              </p>
            )}
          </div>

          <h2 className="mb-4 font-display text-lg font-bold text-ink">
            Price Details
          </h2>

          <div className="space-y-2 text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>

              <span>
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee}`}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>
                  Coupon Discount
                  {appliedCoupon?.code
                    ? ` (${appliedCoupon.code})`
                    : ""}
                </span>

                <span>-₹{couponDiscount}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between border-t border-forest-100 pt-4 font-display text-lg font-bold text-ink">
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing}
            className="btn-primary mt-6 w-full py-3 text-sm md:text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placing
              ? "Processing..."
              : paymentMethod === "Cash on Delivery"
              ? `Place Order ₹${finalTotal}`
              : `Demo Pay ₹${finalTotal}`}
          </button>
        </div>
      </div>
    </div>
  );
}


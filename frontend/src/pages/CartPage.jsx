import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const BASE_URL = "http://localhost:5000";

export default function CartPage() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const getProductImage = (image) => {
    if (!image) return "/placeholder.png";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <ShoppingBag className="mx-auto text-forest-300" size={64} />
        <h1 className="font-display text-2xl font-bold text-ink mt-4">
          Your cart is empty
        </h1>
        <p className="text-ink/50 mt-2">
          Add some fresh products to get started!
        </p>
        <Link to="/" className="btn-primary inline-block mt-6">
          Start Shopping
        </Link>
      </div>
    );
  }

  const deliveryFee = totalPrice >= 199 ? 0 : 25;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <div className="container-app py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-ink">
          Your Cart{" "}
          <span className="text-ink/40 text-lg font-body">
            ({totalItems} items)
          </span>
        </h1>

        <button
          onClick={clearCart}
          className="text-sm font-semibold text-chili-500 hover:text-chili-600"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const price = Number(item.discountPrice || item.price || 0);
            const itemTotal = price * item.quantity;

            return (
              <div
                key={item._id}
                className="card p-4 flex gap-4 items-center"
              >
                <Link
                  to={`/product/${item._id}`}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-mint shrink-0"
                >
                  <img
                    src={getProductImage(item.image)}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-semibold text-sm text-ink hover:text-forest-600 line-clamp-1"
                  >
                    {item.name}
                  </Link>

                  <p className="text-xs text-ink/40 mt-0.5">
                    {item.quantity && item.unit
                      ? `${item.quantity} ${item.unit}`
                      : item.unit || "1 pcs"}
                  </p>

                  <p className="font-display font-bold text-forest-700 mt-1">
                    ₹{price}
                  </p>

                  <p className="text-xs text-ink/40 mt-0.5">
                    Item Total: ₹{itemTotal}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-mint rounded-full px-2 py-1">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="font-bold w-5 text-center text-sm">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-chili-500 hover:text-chili-600 p-2"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>
          </div>

          <div className="border-t border-forest-100 mt-4 pt-4 flex justify-between font-display font-bold text-lg text-ink">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="btn-primary w-full mt-6"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
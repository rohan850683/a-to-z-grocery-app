import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Zap, Truck, ShieldCheck, Clock } from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import SimilarProducts from "../components/SimilarProducts";

const BASE_URL = "http://localhost:5000";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const getProductImage = (image) => {
    if (!image) return "/placeholder.png";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
        setQty(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Product detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
  navigate("/checkout", {
    state: {
      buyNow: true,
      product: {
        ...product,
        quantity: qty,
      },
    },
  });
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Product not found
      </div>
    );
  }

  const discount =
    product.discount ||
    (product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border rounded-2xl p-4 flex items-center justify-center bg-white">
            <img
              src={getProductImage(product.image)}
              alt={product.name}
              className="w-full max-h-[430px] object-contain hover:scale-105 transition duration-300"
            />
          </div>

          <div>
            <p className="text-sm text-green-600 font-semibold mb-2">
              {product.category}
            </p>

            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="text-gray-500 mt-2">{product.unit}</p>

            <div className="flex items-center gap-2 mt-3">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                ⭐ 4.5
              </span>
              <span className="text-sm text-gray-500">120 ratings</span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price}
              </span>

              {product.mrp && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.mrp}
                </span>
              )}

              {discount > 0 && (
                <span className="text-green-600 font-bold">
                  {discount}% OFF
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>

            <div className="mt-6">
              <p className="font-semibold mb-2">Quantity</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 border rounded-lg text-xl font-bold"
                >
                  -
                </button>

                <span className="font-bold text-lg">{qty}</span>

                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  className="w-10 h-10 border rounded-lg text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500"
              >
                <Zap size={20} />
                Buy Now
              </button>

              <button className="border p-3 rounded-xl hover:bg-gray-100">
                <Heart />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <div className="border rounded-xl p-3 text-center">
                <Truck className="mx-auto text-green-600" />
                <p className="font-semibold text-sm mt-2">Fast Delivery</p>
                <p className="text-xs text-gray-500">10-30 minutes</p>
              </div>

              <div className="border rounded-xl p-3 text-center">
                <ShieldCheck className="mx-auto text-green-600" />
                <p className="font-semibold text-sm mt-2">Quality Checked</p>
                <p className="text-xs text-gray-500">Fresh products</p>
              </div>

              <div className="border rounded-xl p-3 text-center">
                <Clock className="mx-auto text-green-600" />
                <p className="font-semibold text-sm mt-2">Easy Return</p>
                <p className="text-xs text-gray-500">Quick support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-3">Product Details</h2>
          <p className="text-gray-600 leading-relaxed">
            {product.description ||
              "Fresh and high-quality product delivered quickly to your doorstep."}
          </p>
        </div>

        <SimilarProducts productId={product._id} />
      </div>
    </div>
  );
}
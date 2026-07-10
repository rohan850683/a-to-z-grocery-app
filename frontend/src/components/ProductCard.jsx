import { Link } from "react-router-dom";
import { Heart, Star, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageUrl } from "../utils/getImageUrl";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { handleToggleWishlist, isInWishlist } = useWishlist();

  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;
  const finalPrice = discountPrice > 0 ? discountPrice : price;

  const averageRating = Number(product.averageRating) || 0;
  const reviewCount = Number(product.reviewCount) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 border">
      <Link to={`/product/${product._id}`}>
        <div className="relative bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleToggleWishlist(product._id);
            }}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition"
          >
            <Heart
              size={20}
              className={
                isInWishlist(product._id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500"
              }
            />
          </button>

          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-contain p-3"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <Clock size={13} />
          <span>{product.deliveryTime || "10 min"}</span>
        </div>

        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {product.quantity && product.unit
            ? `${product.quantity} ${product.unit}`
            : product.unit || "1 pcs"}
        </p>

        <div className="flex items-center gap-1 mt-2">
          <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            <Star size={12} className="fill-white" />
            {averageRating > 0 ? averageRating : "New"}
          </span>

          <span className="text-xs text-gray-500">
            ({reviewCount})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-gray-900">₹{finalPrice}</span>

          {discountPrice > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{price}
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition"
      >
        ADD TO CART
      </button>
    </div>
  );
}
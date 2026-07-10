import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getSimilarProducts } from "../services/productService";

export default function SimilarProducts({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        const data = await getSimilarProducts(productId);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Similar products error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Similar Products</h2>
        <p className="text-gray-500">Loading similar products...</p>
      </div>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Similar Products</h2>

        <Link
          to="/"
          className="text-green-600 text-sm font-semibold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
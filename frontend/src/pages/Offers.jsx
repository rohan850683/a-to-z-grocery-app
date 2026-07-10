import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard.jsx';

export default function Offers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data.products.filter((p) => p.discountPrice)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-app py-8">
      <div className="bg-gradient-to-r from-chili-500 to-chili-600 rounded-3xl p-8 text-white mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">🔥 Today's Best Offers</h1>
        <p className="text-white/85 mt-2">Handpicked discounts across all your favourite categories.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-72 bg-mint rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard.jsx';
import { CATEGORIES } from '../constants/categories.js';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

const SORT_OPTIONS = [
  { key: 'default', label: 'Relevance' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Rating' },
];

export default function Category() {
  const { categoryKey } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlSearch = searchParams.get('search') || '';

  const [searchText, setSearchText] = useState(urlSearch);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState('default');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  const categoryInfo = CATEGORIES.find((c) => c.key === categoryKey);

  useEffect(() => {
    setSearchText(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (categoryKey && categoryKey !== 'grocery') {
          params.set('category', categoryKey);
        }

        if (urlSearch.trim()) {
          params.set('search', urlSearch.trim());
        }

        const res = await api.get(`/products?${params.toString()}`);

        setProducts(res.data.products || []);
      } catch (error) {
        console.log('Category products error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryKey, urlSearch]);

  const handleSearch = (e) => {
    e.preventDefault();

    const q = searchText.trim();

    if (q) {
      navigate(`/category/${categoryKey}?search=${encodeURIComponent(q)}`);
    } else {
      navigate(`/category/${categoryKey}`);
    }
  };

  const resetFilters = () => {
    setSearchText('');
    setSort('default');
    setMaxPrice(1000);
    setMinRating(0);
    navigate(`/category/${categoryKey}`);
  };

  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const price = p.discountPrice || p.price || 0;
      const rating = p.rating || 0;

      const matchesSearch =
        !urlSearch ||
        p.name?.toLowerCase().includes(urlSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(urlSearch.toLowerCase());

      return matchesSearch && price <= maxPrice && rating >= minRating;
    });

    result.sort((a, b) => {
      const priceA = a.discountPrice || a.price || 0;
      const priceB = b.discountPrice || b.price || 0;

      if (sort === 'price-asc') return priceA - priceB;
      if (sort === 'price-desc') return priceB - priceA;
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);

      return 0;
    });

    return result;
  }, [products, sort, maxPrice, minRating, urlSearch]);

  return (
    <div className="container-app py-8">
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="flex items-center gap-2 flex-1 bg-white border border-forest-200 rounded-full px-4 py-2.5 shadow-sm">
          <Search size={18} className="text-forest-500" />

          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search products like cake, chicken, rice..."
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>

        <button className="bg-forest-500 text-white px-5 rounded-full font-semibold hover:bg-forest-600 transition">
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <Link
            key={c.key}
            to={`/category/${c.key}`}
            className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
              c.key === categoryKey
                ? 'bg-forest-500 text-white'
                : 'bg-mint text-ink/70 hover:bg-forest-100'
            }`}
          >
            {c.emoji} {c.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            {urlSearch
              ? `Search Results`
              : categoryInfo
              ? `${categoryInfo.emoji} ${categoryInfo.label}`
              : 'Products'}
          </h1>

          {urlSearch && (
            <p className="text-ink/50 text-sm mt-1">
              Results for “{urlSearch}”
            </p>
          )}

          <p className="text-ink/40 text-sm mt-1">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-forest-50">
          <label className="text-xs font-semibold text-ink/70">
            Max ₹{maxPrice}
            <input
              type="range"
              min="20"
              max="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="block w-36 accent-forest-500"
            />
          </label>

          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="rounded-full border border-forest-200 text-sm px-4 py-2 bg-white focus:outline-none"
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4★ & above</option>
            <option value={4.5}>4.5★ & above</option>
          </select>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-ink/50" />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-forest-200 text-sm px-4 py-2 bg-white focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-bold text-chili-500"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-72 bg-mint rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-forest-50">
          <p className="text-5xl mb-4">🔍</p>

          <h2 className="text-xl font-bold text-ink mb-2">
            No products found
          </h2>

          <p className="text-ink/50 text-sm">
            Try searching for milk, rice, apple, cake, chips or cold drink.
          </p>

          <button onClick={resetFilters} className="btn-primary mt-6">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
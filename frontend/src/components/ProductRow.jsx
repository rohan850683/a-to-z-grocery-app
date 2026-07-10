import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';

export default function ProductRow({ title, subtitle, products = [], loading }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8">
      <div className="container-app">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">{title}</h2>
            {subtitle && <p className="text-ink/50 text-sm mt-1">{subtitle}</p>}
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-forest-200 flex items-center justify-center hover:bg-forest-50 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-forest-200 flex items-center justify-center hover:bg-forest-50 transition"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[220px] h-72 bg-mint rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-ink/40 text-sm py-6">No products found here yet.</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2"
          >
            {products.map((p) => (
              <div key={p._id} className="min-w-[220px] max-w-[220px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

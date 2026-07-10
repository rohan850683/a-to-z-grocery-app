import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories.js';

export default function CategoryGrid() {
  return (
    <section className="py-8">
      <div className="container-app">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-1">
          Shop by Category
        </h2>
        <p className="text-ink/50 text-sm mb-5">Everything you need, from A to Z</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.key}
              to={`/category/${c.key}`}
              className="group flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all animate-fadeUp"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="w-14 h-14 rounded-blob bg-mint flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {c.emoji}
              </span>
              <span className="text-sm font-semibold text-ink text-center">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

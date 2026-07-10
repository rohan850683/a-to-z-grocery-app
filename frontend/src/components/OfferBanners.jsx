import { Link } from 'react-router-dom';

const offers = [
  { title: 'Flat 30% OFF', desc: 'On your first grocery order', to: '/category/groceries', color: 'bg-forest-500', emoji: '🛒' },
  { title: 'Buy 1 Get 1', desc: 'On select ice creams', to: '/category/ice-cream', color: 'bg-chili-500', emoji: '🍨' },
  { title: 'Upto 25% OFF', desc: 'On birthday & anniversary cakes', to: '/category/cake', color: 'bg-mango-500', emoji: '🎂' },
];

export default function OfferBanners() {
  return (
    <section className="py-8">
      <div className="container-app grid grid-cols-1 sm:grid-cols-3 gap-5">
        {offers.map((o) => (
          <Link
            key={o.title}
            to={o.to}
            className={`${o.color} rounded-2xl p-6 text-white flex items-center justify-between overflow-hidden relative group hover:-translate-y-1 transition-transform shadow-card`}
          >
            <div className="relative z-10">
              <p className="font-display text-xl font-bold">{o.title}</p>
              <p className="text-sm text-white/85 mt-1">{o.desc}</p>
              <span className="inline-block mt-3 text-xs font-bold bg-white/20 rounded-full px-3 py-1 group-hover:bg-white/30 transition">
                Shop Now →
              </span>
            </div>
            <span className="text-6xl absolute -right-2 -bottom-2 opacity-30 group-hover:opacity-50 transition">
              {o.emoji}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

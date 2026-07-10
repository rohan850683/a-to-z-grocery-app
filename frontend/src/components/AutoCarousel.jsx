import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

export default function AutoCarousel({ products = [] }) {
  if (!products.length) return null;

  const track = [...products, ...products];

  return (
    <div className="overflow-hidden py-3 bg-mint border-y border-forest-100">
      <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
        {track.map((p, i) => (
          <Link
            key={`${p._id}-${i}`}
            to={`/product/${p._id}`}
            className="flex items-center gap-3 bg-white rounded-full pl-2 pr-4 py-2 shadow-card shrink-0 hover:shadow-cardHover transition"
          >
            <img
              src={getImageUrl(p.image)}
              alt={p.name}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="leading-tight">
              <p className="text-xs font-semibold text-ink whitespace-nowrap">
                {p.name}
              </p>
              <p className="text-xs text-forest-600 font-bold">
                ₹{p.discountPrice || p.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
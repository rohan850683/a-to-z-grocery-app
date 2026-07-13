import { useEffect, useState } from "react";
import api from "../services/api";
import HeroCarousel from "../components/HeroCarousel.jsx";
import AutoCarousel from "../components/AutoCarousel.jsx";
import OfferBanners from "../components/OfferBanners.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import ProductRow from "../components/ProductRow.jsx";
import { Truck, ShieldCheck, Clock3, Leaf } from "lucide-react";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [allForMarquee, setAllForMarquee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await api.get("/products?limit=20");

        const products = res.data.products || [];

        setTrending(products.slice(0, 5));
        setBestSellers(products.slice(5, 10));
        setAllForMarquee(products.slice(0, 12));
      } catch (err) {
        console.error("Home products error:", err);
        setTrending([]);
        setBestSellers([]);
        setAllForMarquee([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <div>
      <div className="container-app pt-2 sm:pt-4 md:pt-6 px-2 sm:px-4">
        <HeroCarousel />
      </div>

      <AutoCarousel products={allForMarquee} />

      <div className="container-app grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 py-5 md:py-8 px-2 sm:px-4">
        {[
          { icon: Clock3, label: "10 Min Delivery" },
          { icon: Leaf, label: "100% Fresh Produce" },
          { icon: ShieldCheck, label: "Secure Payments" },
          { icon: Truck, label: "Free Delivery Above ₹199" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-2 p-3 md:p-4 rounded-xl shadow-sm bg-white"
          >
            <Icon
  className="text-forest-500 w-6 h-6 md:w-7 md:h-7"
/>
            <p className="text-[11px] sm:text-sm font-semibold text-ink/80 leading-4">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="px-2 sm:px-4">
  <CategoryGrid />
</div>
      <div className="px-2 sm:px-4">
  <OfferBanners />
</div>

      <div className="px-2 sm:px-4">
<ProductRow
        title="Trending Now 🔥"
        subtitle="What everyone's buying today"
        products={trending}
        loading={loading}
      />
      </div>

      <ProductRow
        title="Best Sellers ⭐"
        subtitle="Loved by thousands of customers"
        products={bestSellers}
        loading={loading}
      />
    </div>
  );
}
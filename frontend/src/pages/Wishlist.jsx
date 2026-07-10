import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { wishlist, loadingWishlist } = useWishlist();

  if (loadingWishlist) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-2xl font-bold">Loading Wishlist...</h2>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-bold mb-8">❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <div className="text-6xl mb-4">💔</div>

          <h2 className="text-2xl font-bold mb-2">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500">
            Save your favourite products here.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">
            {wishlist.length} item{wishlist.length > 1 ? "s" : ""} in your
            wishlist
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
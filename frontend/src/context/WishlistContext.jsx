import { createContext, useContext, useEffect, useState } from "react";
import { getWishlist, toggleWishlist } from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      setLoadingWishlist(true);
      const data = await getWishlist();
      setWishlist(data.products || []);
    } catch (error) {
      console.log("Wishlist fetch error:", error);
      setWishlist([]);
    } finally {
      setLoadingWishlist(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleToggleWishlist = async (productId) => {
    if (!user) {
      alert("Please login to add product to wishlist");
      return;
    }

    try {
      const data = await toggleWishlist(productId);
      setWishlist(data.products || []);
    } catch (error) {
      console.log("Wishlist toggle error:", error);
      alert("Wishlist update failed");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loadingWishlist,
        fetchWishlist,
        handleToggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
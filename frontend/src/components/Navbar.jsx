import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  MapPin,
  Tag,
  Heart,
  Package,
} from 'lucide-react';

import { CATEGORIES } from '../constants/categories.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import SearchBar from './SearchBar.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { user } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap text-sm font-semibold transition-colors ${
      isActive ? 'text-forest-500' : 'text-ink/70 hover:text-forest-500'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
        <div className="container-app flex items-center gap-2 md:gap-4 py-2 md:py-3">
        <button
          className="lg:hidden p-2 -ml-2 text-forest-600"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
         <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-forest-500 flex items-center justify-center font-display font-bold text-white text-base md:text-lg rotate-3">
            AZ
          </div>

          <div className="leading-tight hidden sm:block">
            <p className="font-display font-bold text-lg text-forest-600">
              A to Z
            </p>
            <p className="text-[11px] text-ink/50 flex items-center gap-1">
              <MapPin size={11} /> Delivery in 10 mins
            </p>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl">
          <SearchBar onSearchDone={() => setOpen(false)} />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto">
          <Link
            to="/offers"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-chili-500"
          >
            <Tag size={16} /> Offers
          </Link>

          {user && (
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-forest-600"
            >
              <Package size={16} /> My Orders
            </Link>
          )}

          <Link to="/wishlist" className="relative p-2 text-chili-500">
            <Heart size={23} />

            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-chili-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2 text-forest-600">
            <ShoppingCart size={24} />

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-chili-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-forest-600"
            >
              🛠️ Admin
            </Link>
          )}

          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-forest-50 rounded-full pl-2 pr-3 py-1.5"
            >
              <span className="w-7 h-7 rounded-full bg-forest-500 text-white flex items-center justify-center text-xs font-bold">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </span>

              <span className="hidden sm:block text-sm font-semibold text-forest-700">
                {user.name?.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn-primary !py-2 !px-3 md:!px-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm"
            >
              <User size={16} /> Login
            </Link>
          )}
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <SearchBar mobile onSearchDone={() => setOpen(false)} />
      </div>

      <nav
        className={`${
          open ? 'block' : 'hidden'
        } lg:block border-t border-forest-50 bg-white lg:bg-mint/60 max-h-[80vh] overflow-y-auto`}
      >
        <div className="container-app flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-6 py-2 lg:py-2.5 overflow-x-auto no-scrollbar">
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>

          <NavLink
            to="/category/grocery"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Categories
          </NavLink>

          {CATEGORIES.map((c) => (
            <NavLink
              key={c.key}
              to={`/category/${c.key}`}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {c.emoji} {c.label}
            </NavLink>
          ))}

          {user && (
            <NavLink
              to="/profile"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              📦 My Orders
            </NavLink>
          )}

          <NavLink
            to="/offers"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Offers
          </NavLink>

          <NavLink
            to="/contact"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Contact Us
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
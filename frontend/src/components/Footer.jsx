import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Apple, PlayCircle } from 'lucide-react';
import { CATEGORIES } from '../constants/categories.js';

export default function Footer() {
  return (
    <footer className="bg-forest-800 text-forest-50 mt-16">
      <div className="container-app py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-display font-semibold mb-4 text-mango-300">About</h4>
          <ul className="space-y-2 text-sm text-forest-100/80">
            <li><Link to="/" className="hover:text-white">About Us</Link></li>
            <li><Link to="/" className="hover:text-white">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/" className="hover:text-white">Press</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-mango-300">Help</h4>
          <ul className="space-y-2 text-sm text-forest-100/80">
            <li><Link to="/" className="hover:text-white">Help Center</Link></li>
            <li><Link to="/" className="hover:text-white">Track Order</Link></li>
            <li><Link to="/" className="hover:text-white">Returns & Refunds</Link></li>
            <li><Link to="/" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-mango-300">Categories</h4>
          <ul className="space-y-2 text-sm text-forest-100/80">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.key}>
                <Link to={`/category/${c.key}`} className="hover:text-white">{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-mango-300">Get the App</h4>
          <div className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-2 bg-forest-700 hover:bg-forest-600 rounded-xl px-3 py-2 text-sm transition">
              <Apple size={20} /> App Store
            </a>
            <a href="#" className="flex items-center gap-2 bg-forest-700 hover:bg-forest-600 rounded-xl px-3 py-2 text-sm transition">
              <PlayCircle size={20} /> Google Play
            </a>
          </div>
          <div className="flex gap-3 mt-5">
            <a href="#" aria-label="Facebook" className="hover:text-mango-300"><Facebook size={20} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-mango-300"><Instagram size={20} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-mango-300"><Twitter size={20} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-mango-300"><Youtube size={20} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-forest-700 py-5">
        <div className="container-app flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-forest-200/70">
          <p>© {new Date().getFullYear()} A to Z Grocery. All rights reserved.</p>
          <p>Made with 💚 for fresh, fast grocery delivery.</p>
        </div>
      </div>
    </footer>
  );
}

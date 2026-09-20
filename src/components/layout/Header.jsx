import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  GitCompare,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCompareStore } from '../../stores/useCompareStore';
import { useProductStore } from '../../stores/useProductStore';
import { useUIStore } from '../../stores/useUIStore';
import { CATEGORIES } from '../../lib/constants';
import { formatPrice } from '../../lib/utils';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuthStore();
  const { getSubtotal, getTotalItems } = useCartStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const compareCount = useCompareStore((state) => state.items.length);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const setActiveCategory = useProductStore((state) => state.setActiveCategory);
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav);

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const accountMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedCategory && selectedCategory !== 'all') {
      setActiveCategory(selectedCategory);
    }
    setSearchQuery(searchInput);
    navigate('/shop');
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('metro-theme', next ? 'dark' : 'light');
  };

  const totalCartItems = getTotalItems();
  const cartSubtotal = getSubtotal();

  return (
    <div className="bg-[#1a1a2e] text-white py-3.5 px-4">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-1.5 text-gray-300 hover:text-white rounded-lg focus:outline-none"
          aria-label="Open mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-white text-lg shadow-md">
            M
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Metro<span className="text-primary">Optics</span>
            </span>
            <span className="hidden sm:block text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Vision & Frames
            </span>
          </div>
        </Link>

        {/* Wide Search Bar with Category Selector (StarTech style) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-2xl mx-4 items-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-transparent focus-within:border-primary shadow-sm"
        >
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold px-3 py-3 border-r border-gray-200 dark:border-gray-600 outline-none cursor-pointer max-w-[140px] truncate"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search frames, sunglasses, lenses, brands (Ray-Ban, Oakley)..."
            className="flex-1 px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent outline-none placeholder:text-gray-400"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white px-5 py-3 transition-colors flex items-center justify-center"
            aria-label="Submit search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Badges (Right Side) */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-300 hover:text-white rounded-full transition-colors hidden sm:flex"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Compare Action */}
          <Link
            to="/compare"
            className="hidden lg:flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <div className="relative">
              <GitCompare className="w-6 h-6 text-gray-300" />
              {compareCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </div>
            <div className="text-left leading-tight hidden xl:block">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Compare</span>
              <p className="text-xs font-bold text-white">Models ({compareCount})</p>
            </div>
          </Link>

          {/* Wishlist Action */}
          <Link
            to="/profile/wishlist"
            className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <div className="relative">
              <Heart className="w-6 h-6 text-gray-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <div className="text-left leading-tight hidden xl:block">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Saved</span>
              <p className="text-xs font-bold text-white">Wishlist</p>
            </div>
          </Link>

          {/* User Account Dropdown */}
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              aria-label="User Account"
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">
                  {user ? 'Welcome,' : 'Account'}
                </span>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  {user ? user.displayName || user.email?.split('@')[0] : 'Sign In'}
                  <ChevronDown className="w-3 h-3" />
                </p>
              </div>
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 text-gray-800 dark:text-gray-100 text-sm">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.displayName || 'Customer'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4 text-primary" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/profile/orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Package className="w-4 h-4 text-emerald-500" />
                      <span>Order History</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Portal</span>
                      </Link>
                    )}

                    <hr className="my-1 border-gray-100 dark:border-gray-700" />
                    <button
                      onClick={() => {
                        logout();
                        setAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-3">
                      <Link
                        to="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block w-full py-2 px-4 bg-primary text-white text-center font-semibold rounded-lg hover:bg-primary-hover transition-colors text-xs"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                    <div className="px-3 pb-2 text-[11px] text-gray-400">
                      Access orders, prescriptions, and saved wishlists.
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon + Price Badge (StarTech style) */}
          <Link
            to="/cart"
            className="flex items-center gap-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/40 px-3 py-1.5 rounded-lg transition-all"
            aria-label="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-primary" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <span className="text-[10px] text-gray-300 font-semibold uppercase">
                {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}
              </span>
              <p className="text-xs font-black text-white">{formatPrice(cartSubtotal)}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="md:hidden mt-3 flex items-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search frames, sunglasses..."
          className="flex-1 px-3 py-2 text-sm text-gray-900 dark:text-white bg-transparent outline-none"
        />
        <button
          type="submit"
          className="bg-primary text-white p-2.5 flex items-center justify-center"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

import { Link } from 'react-router-dom';
import {
  X,
  User,
  Heart,
  GitCompare,
  ShoppingBag,
  Package,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCompareStore } from '../../stores/useCompareStore';
import { CATEGORIES, SITE_CONFIG } from '../../lib/constants';

export default function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();
  const { user, isAdmin, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const compareCount = useCompareStore((state) => state.items.length);

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setMobileNavOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-4 bg-[#1a1a2e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white text-base">
              M
            </div>
            <span className="font-black text-lg tracking-tight">
              Metro<span className="text-primary">Optics</span>
            </span>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Bar */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800">
          {user ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user.displayName || user.email}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileNavOpen(false);
                }}
                className="text-xs text-red-600 font-semibold hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileNavOpen(false)}
                className="flex-1 py-2 text-center text-xs font-bold text-white bg-primary rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileNavOpen(false)}
                className="flex-1 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Product Categories
            </p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-800" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Quick Shortcuts
            </p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <Link
                to="/cart"
                onClick={() => setMobileNavOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1"
              >
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="text-xs font-semibold">Cart ({cartCount})</span>
              </Link>

              <Link
                to="/profile/wishlist"
                onClick={() => setMobileNavOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1"
              >
                <Heart className="w-5 h-5 text-accent" />
                <span className="text-xs font-semibold">Wishlist ({wishlistCount})</span>
              </Link>

              <Link
                to="/compare"
                onClick={() => setMobileNavOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1"
              >
                <GitCompare className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-semibold">Compare ({compareCount})</span>
              </Link>

              <Link
                to="/track-order"
                onClick={() => setMobileNavOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1"
              >
                <Package className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-semibold">Track Order</span>
              </Link>
            </div>
          </div>

          {isAdmin && (
            <div className="pt-2">
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 p-3 bg-primary/10 text-primary font-bold text-xs rounded-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Portal</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Support Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 text-xs text-gray-500">
          <p className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>Support: {SITE_CONFIG.phone}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

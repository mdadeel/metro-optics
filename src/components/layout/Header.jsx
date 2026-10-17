import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  ChevronDown,
  Heart,
  Menu,
  Moon,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sun,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useProductStore } from '../../stores/useProductStore';
import { useUIStore } from '../../stores/useUIStore';
import LogoMark from './LogoMark';

function SearchForm({ mobile, value, onChange, onSubmit }) {
  return (
    <form className={`mo-search${mobile ? ' mo-search--mobile' : ''}`} onSubmit={onSubmit} role="search">
      <Search size={17} aria-hidden="true" />
      <label className="sr-only" htmlFor={mobile ? 'mo-mobile-search' : 'mo-desktop-search'}>Search eyewear</label>
      <input
        id={mobile ? 'mo-mobile-search' : 'mo-desktop-search'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        placeholder="Search frames, brands, styles..."
      />
      <button type="submit" aria-label="Search">
        <span>Search</span><Search size={15} aria-hidden="true" />
      </button>
    </form>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeQuery = searchParams.get('q') || '';
  const { user, isAdmin, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const setActiveCategory = useProductStore((state) => state.setActiveCategory);
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav);
  const { theme, setTheme } = useTheme();
  const [searchInput, setSearchInput] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setSearchInput(routeQuery);
  }, [routeQuery]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchInput.trim();
    setSearchQuery(query);
    setActiveCategory('all');
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
  };

  return (
    <header className="mo-header">
      <div className="mo-header__inner">
        <button
          className="mo-header__menu-toggle"
          type="button"
          onClick={toggleMobileNav}
          aria-label="Open navigation menu"
        >
          <Menu size={21} aria-hidden="true" />
        </button>

        <Link to="/" className="mo-logo" aria-label="Metro Optics home">
          <span className="mo-logo__mark"><LogoMark size={22} /></span>
          <span className="mo-logo__type"><strong>METRO</strong><span>OPTICS</span><small>SEE YOURSELF CLEARLY</small></span>
        </Link>

        <SearchForm value={searchInput} onChange={setSearchInput} onSubmit={handleSearchSubmit} />

        <div className="mo-header__actions">
          <button
            className="mo-header__icon mo-header__theme"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
          </button>

          <Link to="/profile/wishlist" className="mo-header__icon mo-header__wishlist" aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ''}`}>
            <Heart size={20} aria-hidden="true" />
            {wishlistCount > 0 && <span className="mo-header__count">{wishlistCount}</span>}
          </Link>

          <div className="mo-account" ref={accountMenuRef}>
            <button
              type="button"
              className="mo-header__icon mo-account__trigger"
              onClick={() => setAccountMenuOpen((open) => !open)}
              aria-label="Open account menu"
              aria-expanded={accountMenuOpen}
            >
              <User size={19} aria-hidden="true" />
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            {accountMenuOpen && (
              <div className="mo-account__menu">
                {user ? (
                  <>
                    <div className="mo-account__identity">
                      <strong>{user.displayName || 'Customer'}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link to="/profile" onClick={() => setAccountMenuOpen(false)}><User size={15} /> My profile</Link>
                    <Link to="/profile/orders" onClick={() => setAccountMenuOpen(false)}><Package size={15} /> Order history</Link>
                    {isAdmin && <Link to="/admin/dashboard" onClick={() => setAccountMenuOpen(false)}><ShieldCheck size={15} /> Admin portal</Link>}
                    <button type="button" onClick={() => { logout(); setAccountMenuOpen(false); }}>Sign out</button>
                  </>
                ) : (
                  <>
                    <div className="mo-account__identity"><strong>Welcome to Metro Optics</strong><span>Sign in to see your orders and saved frames.</span></div>
                    <Link to="/login" onClick={() => setAccountMenuOpen(false)}>Sign in</Link>
                    <Link to="/register" onClick={() => setAccountMenuOpen(false)}>Create an account</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="mo-header__bag" aria-label={`Shopping bag, ${totalCartItems} items`}>
            <span className="mo-header__bag-icon">
              <ShoppingBag size={20} aria-hidden="true" />
              {totalCartItems > 0 && <span className="mo-header__count">{totalCartItems}</span>}
            </span>
            <span className="mo-header__bag-label">Bag</span>
          </Link>
        </div>

        <SearchForm mobile value={searchInput} onChange={setSearchInput} onSubmit={handleSearchSubmit} />
      </div>
    </header>
  );
}

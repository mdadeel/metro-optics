import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, List as Menu, X, User, Heart, Sun, Moon, MagnifyingGlass as Search } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { cart, openCart } = useCart();
    const { user } = useAuth();
    const { wishlistCount } = useWishlist();
    const { settings } = useSiteSettings();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const sentinelRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        navigate(`/shop?search=${encodeURIComponent(q)}`);
        setSearchOpen(false);
        setSearchQuery('');
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(
            ([entry]) => setScrolled(!entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    // Close overlays when navigating
    const [prevPath, setPrevPath] = useState(location.pathname);
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        if (isOpen) setIsOpen(false);
        if (searchOpen) setSearchOpen(false);
    }

    const isHomePage = location.pathname === '/';
    // Transparent style only when on the homepage hero and not scrolled down
    const hasSolidNav = !isHomePage || scrolled;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <div ref={sentinelRef} className="absolute top-0 left-0 w-px h-px pointer-events-none" />
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                hasSolidNav
                    ? 'bg-white/85 dark:bg-[#0A0A0A]/85 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06)] border-b border-black/5 dark:border-white/5'
                    : 'bg-gradient-to-b from-black/20 to-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <Link to="/" className="flex items-center gap-3 shrink-0 group">
                            <div className="w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center">
                                {settings.logoUrl ? (
                                    <img src={settings.logoUrl} alt="Logo" className="w-9 h-9 lg:w-11 lg:h-11 object-contain transition-transform duration-300 group-hover:scale-105" />
                                ) : (
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        className={`transition-colors duration-300 ${hasSolidNav ? 'text-foreground' : 'text-white'}`}>
                                        <path d="M2 7C2 5.34315 3.34315 4 5 4H19C20.6569 4 22 5.34315 22 7V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V7Z" stroke="currentColor" strokeWidth="1.5" />
                                        <ellipse cx="8" cy="12" rx="2" ry="3" stroke="currentColor" strokeWidth="1.5" />
                                        <ellipse cx="16" cy="12" rx="2" ry="3" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M12 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                )}
                            </div>
                            <span className={`text-xl lg:text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                                hasSolidNav ? 'text-foreground' : 'text-white'
                            }`}>
                                {settings.siteTitle || "Metro Optics"}
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? hasSolidNav
                                                    ? 'text-[#1E3A5F] dark:text-[#B89458]'
                                                    : 'text-white'
                                                : hasSolidNav
                                                    ? 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-underline"
                                                className={`absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full ${
                                                    hasSolidNav ? 'bg-[#1E3A5F] dark:bg-[#B89458]' : 'bg-white'
                                                }`}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-0.5">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                                    searchOpen
                                        ? 'bg-black/10 dark:bg-white/10 text-foreground'
                                        : hasSolidNav
                                            ? 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                                aria-label="Toggle search"
                            >
                                <Search size={18} weight="bold" />
                            </button>

                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                                    hasSolidNav
                                        ? 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            >
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </button>

                            <Link
                                to="/profile/wishlist"
                                className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                                    hasSolidNav
                                        ? 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Heart size={18} weight="bold" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1E3A5F] dark:bg-[#B89458] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <Link
                                    to="/profile"
                                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                                        hasSolidNav
                                            ? 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <User size={18} weight="bold" />
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                        hasSolidNav
                                            ? 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <User size={16} weight="bold" />
                                    <span className="hidden xl:inline">Login</span>
                                </Link>
                            )}

                            <button
                                onClick={openCart}
                                className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                                    hasSolidNav
                                        ? 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                                aria-label={`Shopping cart with ${totalItems} items`}
                            >
                                <ShoppingCart size={18} weight="bold" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1E3A5F] dark:bg-[#B89458] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            <div className="w-px h-6 mx-1 bg-border/50 hidden lg:block" />

                            <button
                                className={`w-9 h-9 flex items-center justify-center rounded-full lg:hidden transition-all duration-200 ${
                                    isOpen
                                        ? 'bg-black/10 dark:bg-white/10 text-foreground'
                                        : hasSolidNav
                                            ? 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X size={18} weight="bold" /> : <Menu size={18} weight="bold" />}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="border-t border-border/50"
                        >
                            <div className="max-w-2xl mx-auto px-4 py-3">
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" weight="bold" />
                                        <input
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search glasses, sunglasses, brands..."
                                            className="w-full h-10 pl-9 pr-4 bg-surface-secondary dark:bg-neutral-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 dark:focus:ring-[#B89458]/20 transition-all"
                                            aria-label="Search products"
                                            autoFocus
                                        />
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="lg:hidden border-t border-border/50 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-0.5">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            location.pathname === link.path
                                                ? 'bg-[#1E3A5F]/10 dark:bg-[#B89458]/10 text-[#1E3A5F] dark:text-[#B89458]'
                                                : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <hr className="my-2 border-border/50" />
                                <Link
                                    to="/profile/wishlist"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Heart size={18} weight="bold" /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                                </Link>
                                {user ? (
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User size={18} weight="bold" /> Profile
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User size={18} weight="bold" /> Login
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Navbar;

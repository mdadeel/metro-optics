import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import SearchBar from './SearchBar';
import '../styles/components/navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { cart, openCart } = useCart();
    const { user } = useAuth();
    const { wishlistCount } = useWishlist();
    const { settings } = useSiteSettings();
    const location = useLocation();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <nav className={`navbar-modern ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                        ) : (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 7C2 5.34315 3.34315 4 5 4H19C20.6569 4 22 5.34315 22 7V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V7Z" stroke="currentColor" strokeWidth="2" />
                                <ellipse cx="8" cy="12" rx="2" ry="3" stroke="currentColor" strokeWidth="2" />
                                <ellipse cx="16" cy="12" rx="2" ry="3" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>
                    <span className="navbar-logo-text">{settings.siteTitle || "Metro Optics"}</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Search Bar (Desktop) */}
                <div className="navbar-search-desktop">
                    <SearchBar />
                </div>

                {/* Right Actions */}
                <div className="navbar-actions">
                    {/* Desktop Only Icons (Wishlist, Profile) */}
                    <div className="navbar-desktop-only">
                        {/* Wishlist */}
                        <Link to="/profile/wishlist" className="navbar-icon-btn" title="Wishlist">
                            <Heart size={22} />
                            {wishlistCount > 0 && (
                                <span className="navbar-badge">{wishlistCount}</span>
                            )}
                        </Link>

                        {/* Profile/Login */}
                        {user ? (
                            <Link to="/profile" className="navbar-profile-btn" title={user.displayName || user.email}>
                                <User size={20} />
                                <span className="navbar-btn-text">Profile</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="navbar-login-btn">
                                <User size={20} />
                                <span className="navbar-btn-text">Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Cart (Always Visible) */}
                    <button
                        onClick={openCart}
                        className="navbar-cart-btn"
                        aria-label={`Shopping cart with ${totalItems} items`}
                    >
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="navbar-badge">{totalItems}</span>
                        )}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="navbar-mobile-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="navbar-mobile-menu">
                    <div className="navbar-mobile-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`navbar-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile Extensions: Wishlist & Profile */}
                        <div className="navbar-mobile-divider" style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }}></div>

                        <Link
                            to="/profile/wishlist"
                            className="navbar-mobile-link"
                            onClick={() => setIsOpen(false)}
                        >
                            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                        </Link>

                        {user ? (
                            <Link
                                to="/profile"
                                className="navbar-mobile-link"
                                onClick={() => setIsOpen(false)}
                            >
                                Profile
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="navbar-mobile-link"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Heart,
  HelpCircle,
  Phone,
  ShoppingBag,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { CATEGORIES, SITE_CONFIG } from '../../lib/constants';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import LogoMark from './LogoMark';

export default function MobileNav() {
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);
  const { user, isAdmin, logout } = useAuthStore();
  const { settings } = useSiteSettings();
  const phone = settings.sitePhone || SITE_CONFIG.phone;
  const cartItems = useCartStore((state) => state.items);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!mobileNavOpen) return null;

  const closeMenu = () => setMobileNavOpen(false);

  return (
    <div className="mo-mobile-nav">
      <button className="mo-mobile-nav__backdrop" type="button" onClick={closeMenu} aria-label="Close navigation" />
      <aside className="mo-mobile-nav__panel" aria-label="Mobile navigation">
        <div className="mo-mobile-nav__header">
          <Link to="/" className="mo-logo mo-logo--mobile" onClick={closeMenu}>
            <span className="mo-logo__mark"><LogoMark size={20} /></span>
            <span className="mo-logo__type"><strong>METRO</strong><span>OPTICS</span><small>SEE YOURSELF CLEARLY</small></span>
          </Link>
          <button type="button" onClick={closeMenu} aria-label="Close menu"><X size={20} /></button>
        </div>

        <div className="mo-mobile-nav__account">
          {user ? (
            <>
              <div><span className="mo-mobile-nav__label">Signed in as</span><strong>{user.displayName || user.email}</strong></div>
              <button type="button" onClick={() => { logout(); closeMenu(); }}>Sign out</button>
            </>
          ) : (
            <>
              <div><span className="mo-mobile-nav__label">Your Metro account</span><strong>Welcome to a clearer view.</strong></div>
              <Link to="/login" onClick={closeMenu}>Sign in <ArrowUpRight size={14} /></Link>
            </>
          )}
        </div>

        <div className="mo-mobile-nav__scroll">
          <div className="mo-mobile-nav__section-head"><span>Shop by collection</span><Link to="/shop" onClick={closeMenu}>View all</Link></div>
          <nav className="mo-mobile-nav__categories" aria-label="Eyewear categories">
            {CATEGORIES.map((category) => (
              <Link key={category.id} to={`/shop?category=${category.slug}`} onClick={closeMenu}>
                <span>{category.name}</span><ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="mo-mobile-nav__section-head"><span>Your shortcuts</span></div>
          <div className="mo-mobile-nav__shortcuts">
            <Link to="/cart" onClick={closeMenu}><ShoppingBag size={18} /><span>Bag</span><small>{cartCount}</small></Link>
            <Link to="/profile/wishlist" onClick={closeMenu}><Heart size={18} /><span>Saved</span><small>{wishlistCount}</small></Link>
            <Link to="/faq" onClick={closeMenu}><HelpCircle size={18} /><span>Help</span><ArrowUpRight size={13} /></Link>
          </div>
          {isAdmin && <Link className="mo-mobile-nav__admin" to="/admin/dashboard" onClick={closeMenu}><ShieldCheck size={16} /> Admin portal</Link>}
        </div>

        <div className="mo-mobile-nav__footer">
          <span>Need a hand choosing?</span>
          <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}><Phone size={14} /> {phone}</a>
        </div>
      </aside>
    </div>
  );
}

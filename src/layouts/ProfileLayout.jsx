import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { Package, MapPin, Heart, Gear, SignOut as LogOut, List as Menu, X, FileText, User } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import './ProfileLayout.css';
import SEO from '../components/SEO';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ProfileLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const sidebarRef = useRef(null);
    const menuTriggerRef = useRef(null);
    const closeButtonRef = useRef(null);

    const menuItems = [
        { icon: User, label: 'Overview', path: '/profile' },
        { icon: Package, label: 'Orders', path: '/profile/orders' },
        { icon: Heart, label: 'Wishlist', path: '/profile/wishlist' },
        { icon: MapPin, label: 'Address Book', path: '/profile/addresses' },
        { icon: FileText, label: 'Prescriptions', path: '/profile/prescriptions' },
        { icon: Gear, label: 'Settings', path: '/profile/settings' },
    ];

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2);
    };

    const closeMenu = () => {
        setMobileMenuOpen(false);
        requestAnimationFrame(() => menuTriggerRef.current?.focus());
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        const desktopQuery = window.matchMedia('(min-width: 1024px)');
        const closeOnDesktop = (event) => {
            if (event.matches) setMobileMenuOpen(false);
        };
        desktopQuery.addEventListener('change', closeOnDesktop);
        return () => desktopQuery.removeEventListener('change', closeOnDesktop);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeMenu();
                return;
            }
            if (event.key !== 'Tab') return;
            const focusable = Array.from(sidebarRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || []);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && (document.activeElement === first || !sidebarRef.current?.contains(document.activeElement))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || !sidebarRef.current?.contains(document.activeElement))) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenuOpen]);

    return (
        <div className="profile-layout mo-account-layout">
            <SEO title="My Account" description="Manage your Metro Optics profile, orders, saved frames and account details." noIndex />
            <div className="profile-container">
                <aside
                    ref={sidebarRef}
                    id="account-navigation"
                    className={`profile-sidebar${mobileMenuOpen ? ' open' : ''}`}
                    aria-label="Account navigation"
                    aria-modal={mobileMenuOpen ? 'true' : undefined}
                    role={mobileMenuOpen ? 'dialog' : undefined}
                >
                    <div className="profile-sidebar-header">
                        <Avatar className="profile-avatar">
                            <AvatarFallback>{getInitials(user?.displayName || user?.email)}</AvatarFallback>
                        </Avatar>
                        <div className="profile-user-info">
                            <h2>{user?.displayName || 'Your account'}</h2>
                            <p>{user?.email}</p>
                        </div>
                        <button ref={closeButtonRef} type="button" className="mobile-close-btn" onClick={closeMenu} aria-label="Close account menu">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="profile-nav" aria-label="Account pages">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/profile'}
                                className={({ isActive }) => `profile-nav-item${isActive ? ' active' : ''}`}
                                onClick={() => mobileMenuOpen && closeMenu()}
                            >
                                <item.icon size={18} aria-hidden="true" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="profile-sidebar-footer">
                        <Button variant="outline" className="w-full logout-btn" onClick={handleLogout}>
                            <LogOut size={17} /> Sign out
                        </Button>
                    </div>
                </aside>

                <div className="profile-content-column">
                    <button
                        ref={menuTriggerRef}
                        type="button"
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-controls="account-navigation"
                        aria-expanded={mobileMenuOpen}
                    >
                        <Menu size={18} aria-hidden="true" />
                        <span>Account menu</span>
                    </button>
                    <section className="profile-main mo-account" aria-label="Account content"><Outlet /></section>
                </div>

                {mobileMenuOpen && <button type="button" className="mobile-overlay" onClick={closeMenu} aria-label="Close account menu" />}
            </div>
        </div>
    );
};

export default ProfileLayout;

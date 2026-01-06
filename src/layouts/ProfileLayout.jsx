import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
    User, Package, MapPin, Heart, Settings, LogOut, Menu, X, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import './ProfileLayout.css';

const ProfileLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const menuItems = [
        { icon: User, label: 'Overview', path: '/profile' },
        { icon: Package, label: 'Orders', path: '/profile/orders' },
        { icon: Heart, label: 'Wishlist', path: '/profile/wishlist' },
        { icon: MapPin, label: 'Address Book', path: '/profile/addresses' },
        { icon: FileText, label: 'Prescriptions', path: '/profile/prescriptions' },
        { icon: Settings, label: 'Settings', path: '/profile/settings' },
    ];

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <>
            <Navbar />
            <div className="profile-layout">
                <div className="profile-container">
                    {/* Sidebar */}
                    <aside className={`profile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                        {/* User Header */}
                        <div className="profile-sidebar-header">
                            <Avatar className="profile-avatar">
                                <AvatarFallback>{getInitials(user?.displayName || user?.email)}</AvatarFallback>
                            </Avatar>
                            <div className="profile-user-info">
                                <h3>{user?.displayName || 'User'}</h3>
                                <p>{user?.email}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="profile-nav">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.exact}
                                    className={({ isActive }) =>
                                        `profile-nav-item ${isActive ? 'active' : ''}`
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        {/* Logout Button */}
                        <div className="profile-sidebar-footer">
                            <Button
                                variant="outline"
                                className="w-full logout-btn"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} />
                                Logout
                            </Button>
                        </div>

                        {/* Mobile Close Button */}
                        <button
                            className="mobile-close-btn"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </aside>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                        <span>Menu</span>
                    </button>

                    {/* Main Content */}
                    <main className="profile-main">
                        <Outlet />
                    </main>

                    {/* Mobile Overlay */}
                    {mobileMenuOpen && (
                        <div
                            className="mobile-overlay"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileLayout;

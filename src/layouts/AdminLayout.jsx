import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, CreditCard, Settings, LogOut, Home } from 'lucide-react';
import { useEffect } from 'react';

const AdminLayout = () => {
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/admin/login');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) return null;

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { path: '/admin/cms', icon: Settings, label: 'CMS' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-primary">Metro Admin</h1>
                </div>
                <nav className="mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors ${location.pathname === item.path ? 'bg-gray-50 text-primary border-r-4 border-primary' : ''
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    ))}
                    <Link to="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors mt-8 border-t">
                        <Home className="w-5 h-5 mr-3" />
                        View Store
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

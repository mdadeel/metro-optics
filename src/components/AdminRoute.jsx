import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminRoute;

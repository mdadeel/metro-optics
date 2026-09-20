import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="protected-route-loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

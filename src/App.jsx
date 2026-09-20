import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import StoreLayout from './layouts/StoreLayout';
import ProfileLayout from './layouts/ProfileLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SeederPage from './pages/SeederPage';
import NotFound from './pages/NotFound';
import SkipLink from './components/SkipLink';
import ProfileOverview from './pages/profile/ProfileOverview';
import OrderHistory from './pages/profile/OrderHistory';
import AddressBook from './pages/profile/AddressBook';
import Wishlist from './pages/profile/Wishlist';
import ProfileSettings from './pages/profile/ProfileSettings';
import Prescriptions from './components/profile/Prescriptions';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useAuthStore } from './stores/useAuthStore';
import Compare from './pages/Compare';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';

// Admin section is lazy-loaded: it is large, staff-only, and does not need to
// sit in the public storefront bundle.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
  </div>
);

const DashboardRedirect = () => {
  const { user, isAdmin, loading } = useAuthStore();
  if (loading) return <RouteFallback />;
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/profile" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <SkipLink />
      <Toaster position="top-right" richColors />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Admin Login - outside main layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes with layout */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="cms" element={<AdminCMS />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Auth Routes - outside store layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dynamic /dashboard redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Data seeder is a development tool — never expose it in production */}
        {import.meta.env.DEV && (
          <Route path="/seed-data" element={<SeederPage />} />
        )}

        {/* Store Routes with layout */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Catch unmatched store routes with 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Profile Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ProfileOverview />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="addresses" element={<AddressBook />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>
      </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

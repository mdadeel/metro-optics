import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import StoreLayout from './layouts/StoreLayout';
import SkipLink from './components/SkipLink';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useAuthStore } from './stores/useAuthStore';

const ProfileLayout = lazy(() => import('./layouts/ProfileLayout'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Invoice = lazy(() => import('./pages/Invoice'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const SeederPage = lazy(() => import('./pages/SeederPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ProfileOverview = lazy(() => import('./pages/profile/ProfileOverview'));
const OrderHistory = lazy(() => import('./pages/profile/OrderHistory'));
const AddressBook = lazy(() => import('./pages/profile/AddressBook'));
const Wishlist = lazy(() => import('./pages/profile/Wishlist'));
const ProfileSettings = lazy(() => import('./pages/profile/ProfileSettings'));
const Prescriptions = lazy(() => import('./components/profile/Prescriptions'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));

// Admin is lazy-loaded: it is staff-only and does not need to sit in the
// public storefront bundle.
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
  <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading page">
    <span className="mo-route-spinner" />
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
      <ScrollToTop />
      <SkipLink />
      <Toaster position="top-right" richColors />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
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

          <Route path="/dashboard" element={<DashboardRedirect />} />
          {import.meta.env.DEV && <Route path="/seed-data" element={<SeederPage />} />}

          {/* All customer-facing routes share one header, navigation, and footer. */}
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/compare" element={<Navigate to="/shop" replace />} />
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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

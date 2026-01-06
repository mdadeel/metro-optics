import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import StoreLayout from './layouts/StoreLayout';
import ProfileLayout from './layouts/ProfileLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Invoice from './pages/Invoice';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SeederPage from './pages/SeederPage';
import SkipLink from './components/SkipLink';
import ProfileOverview from './pages/profile/ProfileOverview';
import OrderHistory from './pages/profile/OrderHistory';
import AddressBook from './pages/profile/AddressBook';
import Wishlist from './pages/profile/Wishlist';
import ProfileSettings from './pages/profile/ProfileSettings';
import Prescriptions from './components/profile/Prescriptions';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCMS from './pages/admin/AdminCMS';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <ErrorBoundary>
      <SkipLink />
      <Toaster position="top-right" richColors />
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
        <Route path="/seed-data" element={<SeederPage />} />

        {/* Store Routes with layout */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Catch unmatched store routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
    </ErrorBoundary>
  );
}

export default App;

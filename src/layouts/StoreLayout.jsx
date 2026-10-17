import { Outlet } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Header from '../components/layout/Header';
import MegaMenu from '../components/layout/MegaMenu';
import MobileNav from '../components/layout/MobileNav';
import Footer from '../components/layout/Footer';

export default function StoreLayout() {
  return (
    <div className="mo-storefront-shell">
      {/* Slim service and delivery announcement */}
      <TopBar />

      {/* Sticky storefront header and category navigation */}
      <div className="mo-storefront-sticky">
        <Header />
        <MegaMenu />
      </div>

      {/* Mobile Drawer */}
      <MobileNav />

      {/* Main storefront page content */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Store footer */}
      <Footer />
    </div>
  );
}

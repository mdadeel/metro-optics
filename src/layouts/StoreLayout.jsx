import { Outlet } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Header from '../components/layout/Header';
import MegaMenu from '../components/layout/MegaMenu';
import MobileNav from '../components/layout/MobileNav';
import Footer from '../components/layout/Footer';

export default function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Row 1: Slim utility top bar */}
      <TopBar />

      {/* Row 2 & 3: Sticky Header & MegaMenu */}
      <div className="sticky top-0 z-40 shadow-sm">
        <Header />
        <MegaMenu />
      </div>

      {/* Mobile Drawer */}
      <MobileNav />

      {/* Main Page Content Target */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* StarTech 5-Column Mega Footer */}
      <Footer />
    </div>
  );
}

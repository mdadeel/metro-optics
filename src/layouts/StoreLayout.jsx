import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const StoreLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default StoreLayout;

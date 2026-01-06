import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import ProductQuickView from '../components/ProductQuickView';
import { useState } from 'react';

const Home = () => {
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const handleQuickView = (product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setTimeout(() => setQuickViewProduct(null), 300);
    };

    return (
        <main role="main" id="main-content">
            {/* Hero Banner */}
            <HeroSection />

            {/* Featured Categories */}
            <FeaturedCategories />

            {/* Featured Products */}
            <FeaturedProducts onQuickView={handleQuickView} />

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Quick View Modal */}
            <ProductQuickView
                product={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={closeQuickView}
            />
        </main>
    );
};

export default Home;

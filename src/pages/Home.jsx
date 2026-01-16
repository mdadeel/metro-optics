import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import ProductQuickView from '../components/ProductQuickView';
import SEO from '../components/SEO';
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
            <SEO
                title="Home"
                description="Premium eyewear, sunglasses and contact lenses in Bangladesh. Shop the latest trends with free shipping and 7-day returns."
            />
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

import HeroBanner from '../components/home/HeroBanner';
import FeaturedDeals from '../components/home/FeaturedDeals';
import CategoryGrid from '../components/home/CategoryGrid';
import NewArrivals from '../components/home/NewArrivals';
import BrandShowcase from '../components/home/BrandShowcase';
import WhyChooseUs from '../components/home/WhyChooseUs';
import BlogPreview from '../components/home/BlogPreview';
import NewsletterSection from '../components/home/NewsletterSection';
import ProductQuickView from '../components/product/ProductQuickView';

export default function Home() {
  return (
    <div className="max-w-[1320px] mx-auto px-4 py-6 space-y-12">
      {/* 1. StarTech-style Hero Banner + Right Promos + Category Icon Row */}
      <HeroBanner />

      {/* 2. Featured Deals (5-Column StarTech Deals Grid) */}
      <FeaturedDeals />

      {/* 3. Shop By Category (2-Row Visual Category Cards) */}
      <CategoryGrid />

      {/* 4. New Arrivals & Trending Eyewear (5-Column Grid) */}
      <NewArrivals />

      {/* 5. Official Brand Partners Showcase */}
      <BrandShowcase />

      {/* 6. Why Choose Metro Optics */}
      <WhyChooseUs />

      {/* 7. Optical Guides & Optometry Blog */}
      <BlogPreview />

      {/* 8. Newsletter Subscription Banner */}
      <NewsletterSection />

      {/* Global Quick View Modal */}
      <ProductQuickView />
    </div>
  );
}

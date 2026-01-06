import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const HeroSection = () => {
    const { settings } = useSiteSettings();

    return (
        <section className="hero-section" aria-labelledby="hero-heading">
            <div className="hero-background">
                <div className="hero-image-wrapper">
                    <img
                        src={settings.heroImage || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&auto=format&fit=crop&q=80"}
                        alt="Premium eyewear collection"
                        className="hero-image"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <div className="hero-vignette" />
                </div>

                {/* Decorative Elements */}
                <div className="hero-decor-blob blob-1" />
                <div className="hero-decor-blob blob-2" />
                <div className="hero-glass-accent" />
            </div>

            <div className="hero-container">
                <div className="hero-content-wrapper">
                    <div className="hero-text-content">
                        <div className="hero-badge">
                            <span>Exclusive Collection 2026</span>
                        </div>
                        <h1 id="hero-heading" className="hero-title">
                            {settings.heroTitle || "See the World in"}{' '}
                            <span className="hero-highlight">
                                {settings.heroTitleHighlight || "Perfect Clarity"}
                            </span>
                        </h1>
                        <p className="hero-subtitle">
                            {settings.heroSubtitle || "Discover our curated collection of premium eyewear. From classic frames to cutting-edge designs, find your perfect pair."}
                        </p>

                        <div className="hero-actions">
                            <Link to="/shop" className="hero-btn hero-btn-primary">
                                <ShoppingBag size={18} />
                                <span>Shop the Collection</span>
                                <ArrowRight size={18} className="arrow-icon" />
                            </Link>
                            <Link to="/shop?category=New Arrivals" className="hero-btn hero-btn-outline">
                                <span>Explore New Arrivals</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats / Trust Section */}
                    <div className="hero-stats-grid">
                        <div className="hero-stat-item">
                            <div className="stat-number">2000+</div>
                            <div className="stat-label">Style Experts</div>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Designer Frames</div>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat-item">
                            <div className="stat-number">4.9★</div>
                            <div className="stat-label">Customer Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

import { Award, Truck, Shield, Users, Eye, Heart } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const About = () => {
    const { getPage } = useSiteSettings();
    const pageContent = getPage('about');

    return (
        <div className="about-page">
            <div className="about-container">
                {/* Hero Section */}
                <div className="about-hero">
                    <h1 className="about-title">{pageContent.title}</h1>
                    <p className="about-subtitle">
                        Your trusted partner in vision care since 2020
                    </p>
                </div>

                {/* Story Section */}
                <section className="about-section">
                    <div className="about-story">
                        <h2 className="about-section-title">Our Story</h2>
                        <div className="about-story-content">
                            <div className="about-text" style={{ whiteSpace: 'pre-wrap' }}>
                                {pageContent.content}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="about-section about-values">
                    <h2 className="about-section-title">Our Values</h2>
                    <div className="about-values-grid">
                        <div className="about-value-card">
                            <div className="about-value-icon">
                                <Eye size={32} />
                            </div>
                            <h3 className="about-value-title">Vision First</h3>
                            <p className="about-value-text">
                                Your eye health is our priority. We only work with certified opticians and use premium lenses
                                from trusted manufacturers.
                            </p>
                        </div>

                        <div className="about-value-card">
                            <div className="about-value-icon">
                                <Award size={32} />
                            </div>
                            <h3 className="about-value-title">Quality Guaranteed</h3>
                            <p className="about-value-text">
                                Every frame is hand-picked for quality and durability. We stand behind our products with
                                comprehensive warranties.
                            </p>
                        </div>

                        <div className="about-value-card">
                            <div className="about-value-icon">
                                <Heart size={32} />
                            </div>
                            <h3 className="about-value-title">Customer Care</h3>
                            <p className="about-value-text">
                                From selection to delivery, we're with you every step. Our support team is always ready
                                to help you find your perfect pair.
                            </p>
                        </div>

                        <div className="about-value-card">
                            <div className="about-value-icon">
                                <Shield size={32} />
                            </div>
                            <h3 className="about-value-title">Trust & Transparency</h3>
                            <p className="about-value-text">
                                No hidden fees, no surprises. What you see is what you get - competitive pricing with
                                honest product descriptions.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="about-section about-stats">
                    <div className="about-stats-grid">
                        <div className="about-stat">
                            <div className="about-stat-number">2000+</div>
                            <div className="about-stat-label">Happy Customers</div>
                        </div>
                        <div className="about-stat">
                            <div className="about-stat-number">500+</div>
                            <div className="about-stat-label">Frame Styles</div>
                        </div>
                        <div className="about-stat">
                            <div className="about-stat-number">4.9⭐</div>
                            <div className="about-stat-label">Average Rating</div>
                        </div>
                        <div className="about-stat">
                            <div className="about-stat-number">3-5 Days</div>
                            <div className="about-stat-label">Fast Delivery</div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="about-section">
                    <h2 className="about-section-title">Why Choose Metro Optics?</h2>
                    <div className="about-features">
                        <div className="about-feature">
                            <div className="about-feature-icon">
                                <Award />
                            </div>
                            <div className="about-feature-content">
                                <h3 className="about-feature-title">Premium Quality</h3>
                                <p className="about-feature-text">
                                    Hand-picked frames from top brands and manufacturers. Every pair is inspected for quality
                                    before shipping.
                                </p>
                            </div>
                        </div>

                        <div className="about-feature">
                            <div className="about-feature-icon">
                                <Truck />
                            </div>
                            <div className="about-feature-content">
                                <h3 className="about-feature-title">Fast Delivery</h3>
                                <p className="about-feature-text">
                                    Nationwide shipping within 3-5 business days. Track your order every step of the way.
                                </p>
                            </div>
                        </div>

                        <div className="about-feature">
                            <div className="about-feature-icon">
                                <Shield />
                            </div>
                            <div className="about-feature-content">
                                <h3 className="about-feature-title">7-Day Returns</h3>
                                <p className="about-feature-text">
                                    Not satisfied? Return your glasses within 7 days for a full refund. No questions asked.
                                </p>
                            </div>
                        </div>

                        <div className="about-feature">
                            <div className="about-feature-icon">
                                <Users />
                            </div>
                            <div className="about-feature-content">
                                <h3 className="about-feature-title">Expert Support</h3>
                                <p className="about-feature-text">
                                    Our team of certified opticians is here to help you choose the right frames and lenses
                                    for your needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;

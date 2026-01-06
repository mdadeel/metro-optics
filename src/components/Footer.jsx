import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // TODO: Integrate with newsletter service
        console.log('Newsletter subscription:', email);
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-main">
                    {/* Column 1: Brand & Newsletter */}
                    <div className="footer-column footer-brand">
                        <h3 className="footer-brand-title">Metro Optics</h3>
                        <p className="footer-brand-desc">
                            Your trusted partner in vision care. Providing premium eyewear since 2020.
                        </p>

                        {/* Newsletter Signup */}
                        <div className="footer-newsletter">
                            <h4 className="footer-newsletter-title">Subscribe to Our Newsletter</h4>
                            <p className="footer-newsletter-desc">Get exclusive deals and eye care tips</p>
                            {subscribed ? (
                                <div className="footer-newsletter-success">
                                    ✓ Thanks for subscribing!
                                </div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="footer-newsletter-input"
                                    />
                                    <button type="submit" className="footer-newsletter-btn">
                                        <Send size={16} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Shop */}
                    <div className="footer-column">
                        <h3 className="footer-column-title">Shop</h3>
                        <ul className="footer-links">
                            <li><Link to="/shop?category=Eyeglasses">Eyeglasses</Link></li>
                            <li><Link to="/shop?category=Sunglasses">Sunglasses</Link></li>
                            <li><Link to="/shop?category=Blue Light Glasses">Blue Light Glasses</Link></li>
                            <li><Link to="/shop?category=Reading Glasses">Reading Glasses</Link></li>
                            <li><Link to="/shop?category=Kids Glasses">Kids Glasses</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Service */}
                    <div className="footer-column">
                        <h3 className="footer-column-title">Customer Service</h3>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/track-order">Track Order</Link></li>
                            <li><a href="#returns">Returns & Exchanges</a></li>
                            <li><a href="#shipping">Shipping Information</a></li>
                        </ul>
                    </div>

                    {/* Column 4: About & Contact */}
                    <div className="footer-column">
                        <h3 className="footer-column-title">About Us</h3>
                        <ul className="footer-links">
                            <li><Link to="/about">Our Story</Link></li>
                            <li><a href="#quality">Quality Guarantee</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#terms">Terms of Service</a></li>
                        </ul>

                        <div className="footer-contact">
                            <h4 className="footer-contact-title">Contact Info</h4>
                            <div className="footer-contact-item">
                                <Phone size={14} />
                                <span>+880 1234-567890</span>
                            </div>
                            <div className="footer-contact-item">
                                <Mail size={14} />
                                <span>support@metrooptics.com</span>
                            </div>
                            <div className="footer-contact-item">
                                <MapPin size={14} />
                                <span>Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social & Trust Badges */}
                <div className="footer-secondary">
                    <div className="footer-social">
                        <h4 className="footer-social-title">Follow Us</h4>
                        <div className="footer-social-links">
                            <a href="#" className="footer-social-link" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-trust">
                        <div className="footer-trust-badge">
                            <span className="footer-trust-icon">✓</span>
                            <span>Premium Quality</span>
                        </div>
                        <div className="footer-trust-badge">
                            <span className="footer-trust-icon">✓</span>
                            <span>7-Day Returns</span>
                        </div>
                        <div className="footer-trust-badge">
                            <span className="footer-trust-icon">✓</span>
                            <span>Fast Delivery</span>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2025 Metro Optics. All rights reserved.
                    </p>
                    <div className="footer-legal">
                        <a href="#privacy">Privacy</a>
                        <span className="footer-legal-divider">•</span>
                        <a href="#terms">Terms</a>
                        <span className="footer-legal-divider">•</span>
                        <a href="#cookies">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

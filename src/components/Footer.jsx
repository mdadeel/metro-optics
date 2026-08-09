import { Link } from 'react-router-dom';
import { FacebookLogo, InstagramLogo, TwitterLogo, Envelope as Mail, Phone, MapPin, PaperPlaneTilt as Send } from "@phosphor-icons/react";
import { useState } from 'react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        console.log('Newsletter subscription:', email);
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <footer className="bg-[#0F172A] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-16 lg:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
                        <div className="lg:col-span-2">
                            <h3 className="text-xl font-bold tracking-tight mb-4">Metro Optics</h3>
                            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-8">
                                Your trusted partner in vision care. Providing premium eyewear since 2020.
                            </p>

                            <div className="max-w-sm">
                                <h4 className="text-sm font-semibold text-white/80 mb-1">Subscribe to Our Newsletter</h4>
                                <p className="text-xs text-white/40 mb-4">Get exclusive deals and eye care tips</p>
                                {subscribed ? (
                                    <div className="text-sm text-[#B89458] font-medium">✓ Thanks for subscribing!</div>
                                ) : (
                                    <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2.5 rounded-lg bg-[#B89458] hover:bg-[#A37D48] text-white transition-colors shrink-0"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/40 mb-5">Shop</h3>
                            <ul className="space-y-3">
                                <li><Link to="/shop?category=Glasses" className="text-sm text-white/60 hover:text-white transition-colors">Glasses</Link></li>
                                <li><Link to="/shop?category=Sunglasses" className="text-sm text-white/60 hover:text-white transition-colors">Sunglasses</Link></li>
                                <li><Link to="/shop?category=Blue Light Glasses" className="text-sm text-white/60 hover:text-white transition-colors">Blue Light Glasses</Link></li>
                                <li><Link to="/shop?category=Reading Glasses" className="text-sm text-white/60 hover:text-white transition-colors">Reading Glasses</Link></li>
                                <li><Link to="/shop?category=Kids Glasses" className="text-sm text-white/60 hover:text-white transition-colors">Kids Glasses</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/40 mb-5">Customer Service</h3>
                            <ul className="space-y-3">
                                <li><Link to="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link to="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQs</Link></li>
                                <li><Link to="/track-order" className="text-sm text-white/60 hover:text-white transition-colors">Track Order</Link></li>
                                <li><a href="#returns" className="text-sm text-white/60 hover:text-white transition-colors">Returns & Exchanges</a></li>
                                <li><a href="#shipping" className="text-sm text-white/60 hover:text-white transition-colors">Shipping Information</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold tracking-wider uppercase text-white/40 mb-5">About Us</h3>
                            <ul className="space-y-3">
                                <li><Link to="/about" className="text-sm text-white/60 hover:text-white transition-colors">Our Story</Link></li>
                                <li><a href="#quality" className="text-sm text-white/60 hover:text-white transition-colors">Quality Guarantee</a></li>
                                <li><a href="#privacy" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#terms" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>

                            <div className="mt-8 space-y-3">
                                <h4 className="text-sm font-semibold text-white/60">Contact Info</h4>
                                <div className="flex items-center gap-2.5 text-sm text-white/40">
                                    <Phone size={13} />
                                    <span>+880 1234-567890</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm text-white/40">
                                    <Mail size={13} />
                                    <span>support@metrooptics.com</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm text-white/40">
                                    <MapPin size={13} />
                                    <span>Dhaka, Bangladesh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-white/10">
                    <div>
                        <h4 className="text-sm font-semibold text-white/60 mb-3">Follow Us</h4>
                        <div className="flex items-center gap-3">
                            <a href="https://facebook.com/metrooptics" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                                aria-label="Facebook">
                                <FacebookLogo size={16} />
                            </a>
                            <a href="https://instagram.com/metrooptics" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                                aria-label="Instagram">
                                <InstagramLogo size={16} />
                            </a>
                            <a href="https://twitter.com/metrooptics" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                                aria-label="Twitter">
                                <TwitterLogo size={16} />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-white/40">
                            <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px]">✓</span>
                            <span>Premium Quality</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/40">
                            <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px]">✓</span>
                            <span>7-Day Returns</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/40">
                            <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px]">✓</span>
                            <span>Fast Delivery</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/5 text-sm text-white/30">
                    <p>© 2025 Metro Optics. All rights reserved.</p>
                    <div className="flex items-center gap-3">
                        <a href="#privacy" className="hover:text-white/50 transition-colors">Privacy</a>
                        <span>·</span>
                        <a href="#terms" className="hover:text-white/50 transition-colors">Terms</a>
                        <span>·</span>
                        <a href="#cookies" className="hover:text-white/50 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

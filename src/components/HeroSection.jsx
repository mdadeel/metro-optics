import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from '@phosphor-icons/react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { motion } from 'motion/react';

const HeroSection = () => {
    const { settings } = useSiteSettings();

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-labelledby="hero-heading">
            <div className="absolute inset-0">
                <img
                    src={settings.heroImage || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&auto=format&fit=crop&q=80"}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-[#0F172A]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-transparent to-transparent" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-white/10 text-white/90 backdrop-blur-sm border border-white/10 mb-8">
                            Exclusive Collection 2026
                        </span>
                    </motion.div>

                    <motion.h1
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-white mb-6"
                    >
                        {settings.heroTitle || "See the World in"}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4B88A] to-[#B89458]">
                            {settings.heroTitleHighlight || "Perfect Clarity"}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mb-10"
                    >
                        {settings.heroSubtitle || "Discover our curated collection of premium eyewear. From classic frames to cutting-edge designs, find your perfect pair."}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link
                            to="/shop"
                            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#B89458] hover:bg-[#A37D48] text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#B89458]/20 hover:shadow-xl hover:shadow-[#B89458]/30 hover:-translate-y-0.5"
                        >
                            <ShoppingBag size={18} />
                            <span>Shop the Collection</span>
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/shop?category=New Arrivals"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white/90 hover:bg-white/10 text-sm font-medium transition-all duration-300"
                        >
                            <span>Explore New Arrivals</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex items-center gap-8 mt-16 pt-8 border-t border-white/10"
                    >
                        <div>
                            <div className="text-2xl font-bold text-white">2000+</div>
                            <div className="text-sm text-white/50">Style Experts</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <div className="text-2xl font-bold text-white">500+</div>
                            <div className="text-sm text-white/50">Designer Frames</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <div className="text-2xl font-bold text-white">4.9★</div>
                            <div className="text-sm text-white/50">Customer Rating</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

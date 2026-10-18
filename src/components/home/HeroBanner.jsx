import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Glasses, Sun, Monitor, BookOpen, Zap, Eye } from 'lucide-react';
import { CATEGORIES } from '../../lib/constants';

const slides = [
  {
    id: 1,
    title: 'Precision Prescription Eyewear',
    subtitle: '100% Digital Lens Accuracy',
    description: 'Bespoke Italian acetate frames with high-index anti-reflective prescription lenses crafted with precision for all-day comfort.',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1400&auto=format&fit=crop&q=80',
    link: '/shop?category=optical',
    cta: 'Shop Optical Collection',
    badge: 'New 2026 Collection',
  },
  {
    id: 2,
    title: 'Polarized Designer Sunglasses',
    subtitle: '100% UV400 Glare Defense',
    description: 'Teardrop aviators, bold wayfarers, and crystal mineral lenses from Ray-Ban, Persol, and Tom Ford.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1400&auto=format&fit=crop&q=80',
    link: '/shop?category=sunglasses',
    cta: 'Explore Sunglasses',
    badge: 'Up to 30% Off',
  },
  {
    id: 3,
    title: 'Next-Gen Blue-Light Cut Specs',
    subtitle: 'Defend Against Digital Fatigue',
    description: 'Filter high-energy 450nm screen glare without yellow tint. Perfect for software developers & gamers.',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1400&auto=format&fit=crop&q=80',
    link: '/shop?category=blue-light',
    cta: 'Browse Blue-Light Specs',
    badge: 'Doctor Recommended',
  },
];

const categoryPillIcons = {
  sunglasses: Sun,
  optical: Glasses,
  'blue-light': Monitor,
  reading: BookOpen,
  sports: Zap,
  'contact-lenses': Eye,
};

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="space-y-6">
      {/* Top Banner Row (Carousel + Right Promo Banners - StarTech style) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Carousel (3 Columns) */}
        <div className="lg:col-span-3 relative h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-lg group">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex items-center p-6 sm:p-12">
                <div className="max-w-md text-white space-y-3">
                  <span className="inline-block bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {slide.badge}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-200 line-clamp-2">
                    {slide.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:gap-3"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Nav Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-primary w-7' : 'bg-white/60 hover:bg-white'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Promo Banners (1 Column Stacked - StarTech style) */}
        <div className="hidden lg:flex flex-col gap-4">
          {/* Promo 1: Blue Light */}
          <div className="relative flex-1 rounded-2xl overflow-hidden shadow group">
            <img
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80"
              alt="Blue Light Cut"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                ScreenShield Pro
              </span>
              <p className="text-sm font-bold mt-0.5">Zero Fatigue Glasses</p>
              <Link
                to="/shop?category=blue-light"
                className="mt-1 text-xs text-primary-light font-semibold hover:underline flex items-center gap-1"
              >
                <span>Shop Deals</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Promo 2: Sports Eyewear */}
          <div className="relative flex-1 rounded-2xl overflow-hidden shadow group">
            <img
              src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80"
              alt="Sports Eyewear"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Oakley Radar EV
              </span>
              <p className="text-sm font-bold mt-0.5">High-Speed Wrap Frames</p>
              <Link
                to="/shop?category=sports"
                className="mt-1 text-xs text-primary-light font-semibold hover:underline flex items-center gap-1"
              >
                <span>Explore Tech</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories Circular Icon Row (StarTech style) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.slice(0, 6).map((cat) => {
            const IconComponent = categoryPillIcons[cat.id] || Glasses;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

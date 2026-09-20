import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  Flame,
  ArrowRight,
  Sun,
  Glasses,
  Monitor,
  BookOpen,
  Zap,
  Eye,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES } from '../../lib/constants';

const categoryIconMap = {
  sunglasses: Sun,
  optical: Glasses,
  'blue-light': Monitor,
  reading: BookOpen,
  sports: Zap,
  'contact-lenses': Eye,
  accessories: Sparkles,
};

export default function MegaMenu() {
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const leaveTimerRef = useRef(null);

  const handleMouseEnter = (cat) => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setHoveredCategory(cat);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm relative z-40 hidden md:block"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1320px] mx-auto px-4 flex items-center justify-between">
        {/* Left: "All Categories" dropdown */}
        <div className="relative">
          <button
            onClick={() => setAllCategoriesOpen(!allCategoriesOpen)}
            className="flex items-center gap-2.5 bg-primary hover:bg-primary-hover text-white px-5 py-3 font-bold text-sm tracking-wide transition-colors uppercase select-none rounded-t-none"
          >
            <Menu className="w-4 h-4" />
            <span>All Categories</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                allCategoriesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* All Categories Flyout Menu */}
          {allCategoriesOpen && (
            <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-b-lg py-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
              {CATEGORIES.map((category) => {
                const IconComponent = categoryIconMap[category.id] || Glasses;
                return (
                  <Link
                    key={category.id}
                    to={`/shop?category=${category.slug}`}
                    onClick={() => setAllCategoriesOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors font-medium group"
                  >
                    <span className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                      <span>{category.name}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Center: Horizontal Category Links with Hover Mega Menus */}
        <nav className="flex items-center gap-1 xl:gap-2 flex-1 ml-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              className="relative py-3"
              onMouseEnter={() => handleMouseEnter(cat)}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                <span>{cat.name}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </Link>
            </div>
          ))}
        </nav>

        {/* Right: Deals Highlight Pill */}
        <Link
          to="/shop?deals=true"
          className="flex items-center gap-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 border border-accent/20"
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Hot Offers</span>
        </Link>
      </div>

      {/* Mega Menu Flyout Dropdown (StarTech style) */}
      {hoveredCategory && (
        <div
          className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl py-6 px-8 z-50 animate-in fade-in-50"
          onMouseEnter={() => handleMouseEnter(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[1320px] mx-auto grid grid-cols-4 gap-8">
            {/* Column 1 & 2: Subcategories */}
            <div className="col-span-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-800 mb-4 flex items-center gap-2">
                <span>{hoveredCategory.name} Collections</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {hoveredCategory.subcategories?.map((sub) => (
                  <Link
                    key={sub}
                    to={`/shop?category=${hoveredCategory.slug}&sub=${sub.toLowerCase()}`}
                    className="text-xs text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group py-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors" />
                    <span>{sub}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  to={`/shop?category=${hoveredCategory.slug}`}
                  className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline"
                >
                  <span>Explore All {hoveredCategory.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 3: Category Overview & Advice */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                Expert Vision Note
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {hoveredCategory.description}
              </p>
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                  100% Prescription Ready
                </span>
                <p className="text-[11px] text-gray-600 dark:text-gray-300">
                  Upload your pupillary distance (PD) and Rx at checkout for custom certified lenses.
                </p>
              </div>
            </div>

            {/* Column 4: Visual Category Feature */}
            <div className="relative rounded-xl overflow-hidden shadow-md group">
              <img
                src={hoveredCategory.featuredImage}
                alt={hoveredCategory.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  Featured Trend
                </span>
                <p className="text-sm font-bold mt-0.5">{hoveredCategory.name} Showcase</p>
                <Link
                  to={`/shop?category=${hoveredCategory.slug}`}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 hover:text-white underline"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

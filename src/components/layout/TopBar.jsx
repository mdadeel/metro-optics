import { Link } from 'react-router-dom';
import { Phone, MapPin, Truck, GitCompare, HelpCircle } from 'lucide-react';
import { useCompareStore } from '../../stores/useCompareStore';
import { SITE_CONFIG } from '../../lib/constants';

/**
 * TopBar: Slim utility bar mimicking StarTech's top row.
 * Displays phone, store locator, order tracking, and compare counter.
 */
export default function TopBar() {
  const compareCount = useCompareStore((state) => state.items.length);

  return (
    <div className="bg-[#2d2d44] text-white/90 text-xs py-1.5 px-4 border-b border-white/10 hidden md:block">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between">
        {/* Left: Store Assistance */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-white/80">
            <Phone className="w-3.5 h-3.5 text-primary-light" />
            <span>Assistance: </span>
            <strong className="text-white font-semibold">{SITE_CONFIG.phone}</strong>
          </span>
          <span className="hidden lg:flex items-center gap-1.5 text-white/80">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>3 Stores across NY & NJ</span>
          </span>
        </div>

        {/* Right: Quick Utility Links */}
        <div className="flex items-center gap-5">
          <Link
            to="/track-order"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Track Order</span>
          </Link>

          <Link
            to="/compare"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5 text-blue-400" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none">
                {compareCount}
              </span>
            )}
          </Link>

          <Link
            to="/faq"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-white/70" />
            <span>Help & FAQ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
